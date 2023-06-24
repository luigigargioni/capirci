from numpy import pi, absolute, array
from math import cos, sin, radians, ceil, sqrt, atan2, degrees, asin
from ..pybcapclient.bcapclient import BCAPClient
from win32com.client import Dispatch
from PIL import Image
from io import BytesIO
from cv2 import fitEllipse, cvtColor, COLOR_RGB2BGR
from enum import Enum

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
    (_, _), (_, _), angle = fitEllipse(contour)
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
    opencvImage = cvtColor(array(img), COLOR_RGB2BGR)
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
