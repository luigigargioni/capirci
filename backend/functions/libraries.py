from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from backend.models import Task, Object, UserRobot, Location, Action, Robot
from django.db.models import Q
from json import loads
from backend.utils.date import getDateTimeNow
from django.contrib.auth.models import User
from .robot import (
    connect,
    disconnect,
    robot_getvar,
)
from pythonping import ping


def getTaskList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                tasks = Task.objects.filter(Q(owner=username) | Q(shared=True)).values(
                    "id",
                    "name",
                    "description",
                    "last_modified",
                    "owner",
                    "owner__username",
                    "shared",
                )
                return success_response(tasks)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def taskDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                task_id = request.GET.get("id")
                task = Task.objects.get(id=task_id)
                task_fields = task.to_dict(["id", "name", "description", "shared"])
                return success_response(task_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                task_id = data.get("id")
                task = Task.objects.filter(id=task_id)
                task.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                task_name = data.get("name")
                task_shared = data.get("shared")
                task_description = data.get("description")
                task_owner = request.user.id
                date = getDateTimeNow()
                task_created = Task.objects.create(
                    name=task_name,
                    owner=task_owner,
                    description=task_description,
                    shared=task_shared,
                    last_modified=date,
                )
                response = {"id": task_created.id}
                return success_response(response)
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                task_id = data.get("id")
                task_name = data.get("name")
                task_shared = data.get("shared")
                task_description = data.get("description")
                date = getDateTimeNow()
                Task.objects.filter(id=task_id).update(
                    name=task_name,
                    description=task_description,
                    shared=task_shared,
                    last_modified=date,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def getObjectList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                user = User.objects.get(username=username)
                objects = Object.objects.filter(Q(owner=user) | Q(shared=True)).values(
                    "id", "name", "shared", "force", "height", "owner", "keywords"
                )
                return success_response(objects)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def objectDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                object_id = request.GET.get("id")
                object = Object.objects.get(id=object_id)
                object_fields = object.to_dict(
                    ["id", "name", "keywords", "shared", "force", "height"]
                )
                return success_response(object_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                object_id = data.get("id")
                object = Object.objects.filter(id=object_id)
                object.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                object_name = data.get("name")
                object_shared = data.get("shared")
                object_owner = User.objects.get(id=request.user.id)
                Object.objects.create(
                    name=object_name,
                    owner=object_owner,
                    shared=object_shared,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                object_id = data.get("id")
                object_name = data.get("name")
                object_shared = data.get("shared")
                Object.objects.filter(id=object_id).update(
                    name=object_name,
                    shared=object_shared,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def getActionList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                user = User.objects.get(username=username)
                actions = Action.objects.filter(Q(owner=user) | Q(shared=True)).values(
                    "id",
                    "name",
                    "shared",
                    "point",
                    "robot",
                    "owner",
                    "owner__username",
                    "robot__name",
                )
                return success_response(actions)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def actionDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                action_id = request.GET.get("id")
                action = Action.objects.get(id=action_id)
                action_fields = action.to_dict(
                    ["id", "name", "shared", "robot", "point"]
                )
                return success_response(action_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                action_id = data.get("id")
                action = Action.objects.filter(id=action_id)
                action.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                action_name = data.get("name")
                action_shared = data.get("shared")
                action_robot = UserRobot.objects.get(id=data.get("robot"))
                action_point = data.get("point")
                action_owner = User.objects.get(id=request.user.id)
                Action.objects.create(
                    name=action_name,
                    owner=action_owner,
                    shared=action_shared,
                    robot=action_robot,
                    point=action_point,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                action_id = data.get("id")
                action_name = data.get("name")
                action_shared = data.get("shared")
                action_robot = UserRobot.objects.get(id=data.get("robot"))
                action_point = data.get("point")
                Action.objects.filter(id=action_id).update(
                    name=action_name,
                    shared=action_shared,
                    robot=action_robot,
                    point=action_point,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def getLocationList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                user = User.objects.get(username=username)
                locations = Location.objects.filter(
                    Q(owner=user) | Q(shared=True)
                ).values(
                    "id",
                    "name",
                    "shared",
                    "position",
                    "robot",
                    "owner",
                    "owner__username",
                )
                return success_response(locations)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def locationDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                location_id = request.GET.get("id")
                location = Location.objects.get(Q(id=location_id))
                location_fields = location.to_dict(
                    ["id", "name", "shared", "position", "robot"]
                )
                return success_response(location_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                location_id = data.get("id")
                user = User.objects.get(id=request.user.id)
                location = Location.objects.filter(Q(id=location_id) & Q(owner=user))
                location.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                location_name = data.get("name")
                location_shared = data.get("shared")
                location_position = data.get("position")
                location_robot = Robot.objects.get(id=data.get("robot"))
                location_owner = User.objects.get(id=request.user.id)
                Location.objects.create(
                    name=location_name,
                    owner=location_owner,
                    shared=location_shared,
                    position=location_position,
                    robot=location_robot,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                location_id = data.get("id")
                location_name = data.get("name")
                location_shared = data.get("shared")
                location_position = data.get("position")
                location_robot = UserRobot.objects.get(id=data.get("robot"))
                Location.objects.filter(id=location_id).update(
                    name=location_name,
                    shared=location_shared,
                    position=location_position,
                    robot=location_robot,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def getMyRobotList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                username = request.user
                user = User.objects.get(username=username)
                myRobots = UserRobot.objects.filter(Q(user=user)).values(
                    "id", "name", "robot__name", "robot"
                )
                return success_response(myRobots)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def myRobotDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                myRobot_id = request.GET.get("id")
                myRobot = UserRobot.objects.get(id=myRobot_id)
                myRobot_fields = myRobot.to_dict(["id", "name", "robot"])
                return success_response(myRobot_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                myRobot_id = data.get("id")
                myRobot = UserRobot.objects.filter(id=myRobot_id)
                myRobot.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                myRobot_name = data.get("name")
                myRobot_robot_id = data.get("robot")
                myRobot_user = User.objects.get(id=request.user.id)
                myRobot_robot = Robot.objects.get(id=myRobot_robot_id)
                UserRobot.objects.create(
                    name=myRobot_name, user=myRobot_user, robot=myRobot_robot
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                myRobot_id = data.get("id")
                myRobot_name = data.get("name")
                UserRobot.objects.filter(id=myRobot_id).update(
                    name=myRobot_name,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def takePositionLocation(request: HttpRequest) -> HttpResponse:
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
                        "X": "" + str(curr_pos[0]) + "",
                        "Y": "" + str(curr_pos[1]) + "",
                        "Z": "" + str(curr_pos[2]) + "",
                        "RX": "" + str(curr_pos[3]) + "",
                        "RY": "" + str(curr_pos[4]) + "",
                        "RZ": "" + str(curr_pos[5]) + "",
                        "FIG": "" + str(curr_pos[6]) + "",
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


def takePointAction(request: HttpRequest) -> HttpResponse:
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
                    position = (
                        "::"
                        + str(curr_pos[0])
                        + ","
                        + str(curr_pos[1])
                        + ","
                        + str(curr_pos[2])
                        + ","
                        + str(curr_pos[3])
                        + ","
                        + str(curr_pos[4])
                        + ","
                        + str(curr_pos[5])
                        + ","
                        + str(curr_pos[6])
                        + "::"
                    )
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
