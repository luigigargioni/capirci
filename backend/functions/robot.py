from numpy import pi, absolute, array
from math import cos, sin, radians, ceil, sqrt, atan2, degrees, asin
from ..pybcapclient.bcapclient import BCAPClient
from win32com.client import Dispatch
from PIL import Image
from io import BytesIO
import cv2
from pythoncom import CoInitialize
from enum import Enum
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from django.http import HttpResponse, HttpRequest
from json import loads, dumps
from pythonping import ping
from backend.models import UserRobot, Robot, Task, Object, Location, Action
from django.contrib.auth.models import User
from numpy import zeros, frombuffer, uint8
from xml.etree.ElementTree import fromstring
from django.db.models import Q
from math import inf
import base64

PIX_MM_RATIO = 9.222
CAMERA_ROBOT_DISTANCE = 52.38570925983608  # mm

BCAP_MACHINE_NAME = "localhost"


class CaoParams(Enum):
    PROVIDER = "CaoProv.DENSO.VRC"
    ENGINE = "CAO.CaoEngine"
    CANON_CAMERA = "CaoProv.Canon.N10-W02"


class RobotAction(Enum):
    MOTOR = "Motor"
    GIVE_ARM = "GiveArm"
    TAKE_ARM = "TakeArm"
    ARM_0 = "Arm0"


class CameraAction(Enum):
    ONE_SHOT_WHITE_BALANCE = "OneShotWhiteBalance"
    ONE_SHOT_FOCUS = "OneShotFocus"


class CameraResolution(Enum):
    WIDTH = 1920
    HEIGHT = 1080


INITIAL_POSITION = """@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0,
                                    179.99584205147127, 261.0)"""
DEFAULT_TIMEOUT = 14400
MAX_SPEED = "SPEED=100"


def polar_to_robot_coordinates(angle, robot_x, robot_y, module=CAMERA_ROBOT_DISTANCE):
    offset_x = module * cos(radians(angle))
    offset_y = -module * sin(radians(angle))
    return robot_x + offset_x, robot_y + offset_y


def pixels_to_cartesian(
    img_x,
    img_y,
    width=CameraResolution.WIDTH.value,
    height=CameraResolution.HEIGHT.value,
):  # for opencv coordinates, not numpy
    cartesian_x = img_x - width / 2.0
    cartesian_y = -img_y + height / 2.0
    return cartesian_x, cartesian_y


def find_polar_coordinates(angle, camera_x, camera_y):
    (x, y) = pixels_to_cartesian(camera_x, camera_y)

    if absolute(x) > ceil(PIX_MM_RATIO):
        L2 = sqrt(x**2 + y**2) / PIX_MM_RATIO

        alpha2 = atan2(y, x) * (180.0 / pi)

        if x > 0 and y < 0:
            alpha3 = 90 - absolute(alpha2)

            L3 = sqrt(
                CAMERA_ROBOT_DISTANCE**2
                + L2**2
                - 2 * L2 * CAMERA_ROBOT_DISTANCE * cos(radians(alpha3))
            )

            alpha4 = degrees(asin((float(L2) / L3) * (sin(radians(alpha3)))))

            alpha5 = angle + alpha4

        if x > 0 and y >= 0:
            alpha3 = 90 + alpha2

            L3 = sqrt(
                CAMERA_ROBOT_DISTANCE**2
                + L2**2
                - 2 * L2 * CAMERA_ROBOT_DISTANCE * cos(radians(alpha3))
            )

            alpha4 = degrees(asin((float(L2) / L3) * (sin(radians(alpha3)))))

            alpha5 = angle + alpha4

        if x < 0 and y >= 0:
            alpha3 = 360 - (absolute(alpha2) + 90)

            L3 = sqrt(
                CAMERA_ROBOT_DISTANCE**2
                + L2**2
                - 2 * L2 * CAMERA_ROBOT_DISTANCE * cos(radians(alpha3))
            )

            alpha4 = degrees(asin((float(L2) / L3) * (sin(radians(alpha3)))))

            alpha5 = angle - alpha4

        if x < 0 and y < 0:
            alpha3 = absolute(alpha2 + 90)

            L3 = sqrt(
                CAMERA_ROBOT_DISTANCE**2
                + L2**2
                - 2 * L2 * CAMERA_ROBOT_DISTANCE * cos(radians(alpha3))
            )

            alpha4 = degrees(asin((float(L2) / L3) * (sin(radians(alpha3)))))

            alpha5 = angle - alpha4

        return (L3, alpha5)

    else:
        L3 = CAMERA_ROBOT_DISTANCE + (y / PIX_MM_RATIO)
        return (L3, angle)


def find_orientation(contour, robot_angle):
    (_, _), (_, _), angle = cv2.fitEllipse(contour)
    new_angle = 0

    if angle <= 90:
        if robot_angle <= 0:
            new_angle = robot_angle + angle
        elif robot_angle > 0 and angle >= 50:
            beta = 90 - angle
            gamma = 90 - robot_angle
            new_angle = -(gamma + beta)
        elif robot_angle > 0 and angle < 50:
            new_angle = robot_angle + angle
    else:
        if robot_angle > 0:
            beta = 180 - angle
            new_angle = robot_angle - beta
        elif robot_angle <= 0 and angle <= 160:
            new_angle = robot_angle + angle
        elif robot_angle <= 0 and angle > 160:
            beta = 180 - angle
            new_angle = robot_angle - beta

    return new_angle


def robot_take_arm(client, hRobot):
    client.robot_execute(hRobot, RobotAction.TAKE_ARM, [0, 0])


def robot_give_arm(client, hRobot):
    client.robot_execute(hRobot, RobotAction.GIVE_ARM)


def robot_give_arm_cao(caoRobot):
    caoRobot.Execute(RobotAction.GIVE_ARM)


def robot_motor(client, hRobot):
    client.robot_execute(hRobot, RobotAction.MOTOR, [1, 0])


def robot_motor_cao(caoRobot):
    caoRobot.Execute(RobotAction.MOTOR, [1, 0])


def connect(host, port, timeout, provider=CaoParams.PROVIDER):
    client = BCAPClient(host, port, timeout)
    client.service_start("")
    Name = ""
    Provider = provider
    Machine = BCAP_MACHINE_NAME
    Option = ""
    hCtrl = client.controller_connect(Name, Provider, Machine, Option)
    hRobot = client.controller_getrobot(hCtrl, RobotAction.ARM_0)
    robot_take_arm(client, hRobot)
    robot_motor(client, hRobot)
    return (client, hCtrl, hRobot)


def disconnect(client, hCtrl, hRobot):
    robot_motor(client, hRobot)
    robot_give_arm(client, hRobot)
    client.controller_disconnect(hCtrl)
    client.service_stop()


def robot_getvar(client, hRobot, name):
    assert isinstance(client, BCAPClient)
    var_handle = client.robot_getvariable(hRobot, name)
    value = client.variable_getvalue(var_handle)
    client.variable_release(var_handle)
    return value


def take_img(CVconv=True, wb=False, oneshotfocus=False, cameraip=0):
    eng = Dispatch(CaoParams.ENGINE)
    ctrl = eng.Workspaces(0).AddController(
        "", CaoParams.CANON_CAMERA, "", "Server=" + str(cameraip) + ", Timeout=5000"
    )
    image_handle = ctrl.AddVariable("IMAGE")
    if wb:
        ctrl.Execute(CameraAction.ONE_SHOT_WHITE_BALANCE)
    if oneshotfocus:
        ctrl.Execute(CameraAction.ONE_SHOT_FOCUS)
    image = image_handle.Value
    stream = BytesIO(image)
    img = Image.open(stream)
    opencvImage = cv2.cvtColor(array(img), cv2.COLOR_RGB2BGR)
    del image_handle
    del ctrl
    del eng
    if CVconv:
        return opencvImage
    else:
        return img


def switch_bcap_to_orin(client, hRobot, caoRobot):
    robot_give_arm(client, hRobot)
    robot_take_arm(client, hRobot)
    robot_motor_cao(caoRobot)


def switch_orin_to_bcap(client, hRobot, caoRobot):
    robot_give_arm_cao(caoRobot)
    robot_take_arm(client, hRobot)
    robot_motor(client, hRobot)


def list_to_string_position(pos):
    return "P(" + ", ".join(str(i) for i in pos) + ")"


def list_to_string_joints(pos):
    return "J(" + ", ".join(str(i) for i in pos) + ")"


def move_to_new_pos(client, hRobot, new_x, new_y, mode=2):
    curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
    curr_pos[0] = new_x
    curr_pos[1] = new_y
    client.robot_move(hRobot, mode, list_to_string_position(curr_pos), "SPEED=100")


def take_position(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                robot_id = data.get("robot")
                user_robot = UserRobot.objects.get(id=robot_id)
                robot = Robot.objects.get(id=user_robot.robot.id)
                ResponseList = ping(robot.ip, count=1)
                if (
                    hasattr(ResponseList, "responses")
                    and ResponseList.responses[0].success is True
                ):
                    (client, hCtrl, hRobot) = connect(robot.ip, robot.port, 14400)
                    curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
                    position = {
                        "X": +curr_pos[0],
                        "Y": +curr_pos[1],
                        "Z": +curr_pos[2],
                        "RX": +curr_pos[3],
                        "RY": +curr_pos[4],
                        "RZ": +curr_pos[5],
                        "FIG": +curr_pos[6],
                    }
                    disconnect(client, hCtrl, hRobot)
                    return success_response(position)
                else:
                    return error_response(str("Robot not connected"))
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def runTask(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                task_id = data.get("task_id")
                robot_id = data.get("robot_id")
                user = User.objects.get(id=request.user.id)
                userRobot = UserRobot.objects.get(id=robot_id)
                robot = Robot.objects.get(id=userRobot.id)
                ip = robot.ip
                port = robot.port
                camera = robot.cameraip

                CoInitialize()
                eng = Dispatch("CAO.CaoEngine")
                ctrl = eng.Workspaces(0).AddController(
                    "", "CaoProv.DENSO.RC8", "", "Server=" + str(ip)
                )
                caoRobot = ctrl.AddRobot("robot0", "")

                data_result = {
                    "pickExist": False,
                    "placeExist": False,
                    "actionExist": False,
                    "objectNotFound": None,
                    "finishTask": None,
                }
                place_position = None
                action_point = None
                action_position = None
                force = None

                taskCode = (
                    Task.objects.get(id=task_id)
                    .filter(owner=user)
                    .values_list("code", flat=True)
                    .first()
                )
                file = fromstring(taskCode)

                if file.find("event") is None:
                    search = "repeat/"
                    times = file.find("repeat").get("times")
                else:
                    search = "event/repeat/"
                    times = file.find("event/repeat").get("times")

                pick = file.find(search + "pick").text
                place = file.find(search + "place").text
                action = file.find(search + "action")
                if action is not None:
                    action = action.text

                pickExist = False
                objectUser = Object.objects.filter(Q(owner=user) | Q(shared=True))
                for object in objectUser:
                    if pick == object.name:
                        pickExist = True
                        data_result["pickExist"] = True
                        force = object.force
                        height = object.height
                        break
                    keywords = object.keywords
                    keywords = (
                        str(keywords)
                        .replace("[", "")
                        .replace("]", "")
                        .replace("'", "")
                        .replace(" ", "")
                    )
                    keywords = keywords.split(",")
                    for keyword in keywords:
                        if pick == keyword:
                            pickExist = True
                            data_result["pickExist"] = True
                            pick = object.name
                            force = object.force * 8
                            break

                placeExist = False
                objectPlace = Location.objects.filter(Q(owner=user) | Q(shared=True))
                for object in objectPlace:
                    if place == object.name:
                        placeExist = True
                        data_result["placeExist"] = True
                        place_position = object.position
                        break

                actionExist = None
                data_result["actionExist"] = None
                if action is not None:
                    actionExist = False
                    data_result["actionExist"] = False
                    objectAction = Action.objects.filter(Q(owner=user) | Q(shared=True))
                    for object in objectAction:
                        if action == object.name:
                            actionExist = True
                            data_result["actionExist"] = True
                            action_point = object.point
                            break

                if (
                    (actionExist is not None and not actionExist)
                    or not pickExist
                    or not placeExist
                ):
                    json_result = dumps(data_result)
                    return HttpResponse(json_result)

                # Can access with: place_position['X'], place_position['Y'],... Z, RX, RY, RZ, FIG
                place_position = loads(place_position)

                if action is not None:
                    action_array = loads(action_point)
                    action_position = []
                    for item in action_array["points"]:
                        action_position.append(
                            ",".join(str(value) for value in item.values())
                        )
                    """
                    action_point = action_point.split("::")
                    action_point = action_point[1:-1]
                    action_position = []
                    i = 0
                    while i < len(action_point):
                        action_position.append(action_point[i])
                        i = i + 2
                    """

                (client, hCtrl, hRobot) = connect(ip, port, 14400)

                # Move to calibration position
                client.robot_move(
                    hRobot,
                    1,
                    """@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0,
                                179.99584205147127, 261.0)""",
                    "SPEED=100",
                )
                switch_bcap_to_orin(client, hRobot, caoRobot)
                ctrl.Execute(
                    "HandMoveA", [30, 25]
                )  # Open hand for release object. HandMoveA (apertura in mm, velocità)
                switch_orin_to_bcap(client, hRobot, caoRobot)

                if times != "while":
                    times = int(times)
                else:
                    times = inf

                data_result["objectNotFound"] = False
                data_result["finishTask"] = False

                object_to_pick = Object.objects.filter(name=pick, owner=user).first()

                i = 0
                lastFind = 0
                while i < times:
                    find, lastFind = search_object(
                        client,
                        hRobot,
                        object_to_pick.id,
                        force,
                        lastFind,
                        camera,
                        height,
                        ip,
                    )

                    if find:
                        i = i + 1

                        curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
                        curr_pos[2] = "254.99815172770593"
                        client.robot_move(
                            hRobot, 2, list_to_string_position(curr_pos), "SPEED=50"
                        )

                        # Move to calibration position
                        client.robot_move(
                            hRobot,
                            1,
                            """@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0,
                                        179.99584205147127, 261.0)""",
                            "SPEED=100",
                        )

                        if action is not None:
                            for x in range(0, len(action_position)):
                                client.robot_move(
                                    hRobot,
                                    1,
                                    "@0 P(" + action_position[x] + ")",
                                    "SPEED=100",
                                )

                        # Move to calibration position
                        client.robot_move(
                            hRobot,
                            1,
                            """@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0,
                                        179.99584205147127, 261.0)""",
                            "SPEED=100",
                        )

                        client.robot_move(
                            hRobot,
                            1,
                            "@0 P("
                            + str(place_position["X"])
                            + ", "
                            + str(place_position["Y"])
                            + ", "
                            + str(place_position["Z"])
                            + ", "
                            + str(place_position["RX"])
                            + ", "
                            + str(place_position["RY"])
                            + ", "
                            + str(place_position["RZ"])
                            + ", "
                            + str(place_position["FIG"])
                            + ")",
                            "SPEED=100",
                        )

                        switch_bcap_to_orin(client, hRobot, caoRobot)
                        ctrl.Execute(
                            "HandMoveA", [30, 25]
                        )  # Open hand for release object. HandMoveA (apertura in mm, velocità)
                        switch_orin_to_bcap(client, hRobot, caoRobot)
                    else:
                        data_result["objectNotFound"] = True
                        break
                # Move to calibration position
                client.robot_move(
                    hRobot,
                    1,
                    """@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0,
                                179.99584205147127, 261.0)""",
                    "SPEED=100",
                )
                disconnect(client, hCtrl, hRobot)
                if data_result["objectNotFound"] is False:
                    data_result["finishTask"] = True

                json_result = dumps(data_result)
                return HttpResponse(json_result)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def search_object(client, hRobot, object_id, force, lastFind, camera, objectHeight, ip):
    DISTANCE_MAX = 0.075
    DIFF_AREA_MAX = 40000
    move = 0
    find = False
    pos = lastFind

    # Quadrants used to search for object
    Q0 = "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)"
    Q1 = "@0 P(124.8479084757812, 96.71132432510223, 254.93505849932905, 179.98326477675423, -0.021660598353600596, 179.9971873030206, 261.0)"
    Q2 = "@0 P(201.62729889242553, 96.71465770886049, 254.9352502844515, 179.98348831787996, -0.021534861588810798, 179.99838567272027, 261.0)"
    Q3 = "@0 P(222.45008156262494, -28.895388040937206, 254.9197279214668, 179.9806000045344, -0.029053337503689936, 179.98516581416754, 261.0)"
    Q4 = "@0 P(217.31049652044388, -130.24508774032034, 254.89685566528902, 179.9716479887839, -0.03128951339508686, 179.98066547808395, 261.0)"
    Q5 = "@0 P(133.63413919141982, -131.393237172843, 254.87885013312, 179.9599341526348, -0.027773416827480392, 179.97129867455095, 261.0)"
    Q = [Q0, Q1, Q2, Q3, Q4, Q5]

    eng = Dispatch("CAO.CaoEngine")
    ctrl = eng.Workspaces(0).AddController(
        "", "CaoProv.DENSO.RC8", "", "Server=" + str(ip)
    )
    caoRobot = ctrl.AddRobot("robot0", "")

    object = Object.objects.get(id=object_id)
    original = imread_base64(object.photo)

    (cnts, _) = cv2.findContours(
        original.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE
    )
    areaOriginal = cv2.contourArea(cnts[0])

    while find is False and move < 6:
        client.robot_move(hRobot, 1, Q[pos], "SPEED=100")

        curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
        curr_joints = robot_getvar(client, hRobot, "@CURRENT_ANGLE")
        curr_angle = -curr_joints[0]
        curr_x = curr_pos[0]
        curr_y = curr_pos[1]

        test = take_img(wb=True, cameraip=camera)

        shifted = cv2.pyrMeanShiftFiltering(test, 51, 71)
        gray = cv2.cvtColor(shifted, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
        (cnts, _) = cv2.findContours(
            thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE
        )

        areaMax = 0
        areaMaxi = -1

        for i, cnt in enumerate(cnts):
            area = cv2.contourArea(cnt)
            if areaMax < area:
                areaMax = area
                areaMaxi = i

        diff_area = abs(areaMax - areaOriginal)
        if diff_area > DIFF_AREA_MAX:
            move = move + 1
            pos = pos + 1
            if pos == 6:
                pos = 0
            continue

        outline = zeros(test.shape, dtype="uint8")
        (x, y, width, height) = cv2.boundingRect(cnts[areaMaxi])
        cv2.drawContours(outline, cnts, areaMaxi, (255, 255, 255), -1)
        roi = outline[y : y + height, x : x + width]
        roi = cv2.copyMakeBorder(roi, 15, 15, 15, 15, cv2.BORDER_CONSTANT, value=0)

        test_grey = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        d2 = cv2.matchShapes(original, test_grey, cv2.CONTOURS_MATCH_I2, 0)
        if abs(d2) < DISTANCE_MAX:
            find = True
            # convert the grayscale image to binary image
            # ret, thresh = cv2.threshold(gray, 127, 255, 0)

            # calculate moments of binary image
            M = cv2.moments(cnts[areaMaxi])

            # calculate x,y coordinate of center
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])

            # put text and highlight the center
            # cv2.circle(test, (cX, cY), 5, (0, 0, 255), -1)

            (module, angle) = find_polar_coordinates(curr_angle, cX, cY)

            new_angle = find_orientation(cnts[areaMaxi], curr_angle)
            curr_joints = robot_getvar(client, hRobot, "@CURRENT_ANGLE")
            curr_joints[5] = new_angle + curr_joints[0]
            client.robot_move(hRobot, 1, list_to_string_joints(curr_joints))

            (shape_x, shape_y) = polar_to_robot_coordinates(
                angle, curr_x, curr_y, module
            )
            curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
            curr_pos[0] = shape_x
            curr_pos[1] = shape_y
            client.robot_move(hRobot, 2, list_to_string_position(curr_pos), "SPEED=100")

            curr_pos[2] = objectHeight
            client.robot_move(hRobot, 2, list_to_string_position(curr_pos), "SPEED=50")

            switch_bcap_to_orin(client, hRobot, caoRobot)
            ctrl.Execute(
                "HandMoveH", [force * 6, 1]
            )  # HandMoveH (force (min 6, max 20), direction (1 closing)
            switch_orin_to_bcap(client, hRobot, caoRobot)
            break
        else:
            move = move + 1
            pos = pos + 1
            if pos == 6:
                pos = 0
    return find, pos


def ping_ip(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                ip = data.get("ip")
                ResponseList = ping(ip, count=1)
                if (
                    hasattr(ResponseList, "responses")
                    and ResponseList.responses[0].success is True
                ):
                    return success_response()
                else:
                    return error_response(str("IP not reachable"))
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def imread_base64(base64_string):
    # Remove the header and decode the base64 string
    encoded_data = base64_string.split(",")[1]
    decoded_data = base64.b64decode(encoded_data)

    # Convert the decoded data to a numpy array
    nparr = frombuffer(decoded_data, uint8)

    # Read the image using OpenCV
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    return img
