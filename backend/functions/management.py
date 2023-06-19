from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from backend.models import Robot
from json import loads
from django.contrib.auth.models import User, Group
from django.db.models import OuterRef, Subquery


def getUserList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                users = (
                    User.objects.filter(is_superuser=False)
                    .values(
                        "id",
                        "username",
                        "last_login",
                        "email",
                        "is_active",
                        "date_joined",
                    )
                    .annotate(
                        role=Subquery(
                            Group.objects.filter(user=OuterRef("id")).values("name")[:1]
                        )
                    )
                )
                return success_response(users)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def userDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                user_id = request.GET.get("id")
                user = User.objects.get(id=user_id)
                group = user.groups.values("name")[0]["name"]
                user_fields = {}
                user_fields["id"] = user.id
                user_fields["username"] = user.username
                user_fields["first_name"] = user.first_name
                user_fields["last_name"] = user.last_name
                user_fields["email"] = user.email
                user_fields["role"] = group
                return success_response(user_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                user_id = data.get("id")
                user_active = data.get("active")
                user = User.objects.filter(id=user_id).update(
                    is_active=user_active,
                )
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                user_name = data.get("username")
                User.objects.create(
                    username=user_name,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                user_id = data.get("id")
                user_name = data.get("username")
                User.objects.filter(id=user_id).update(
                    username=user_name,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def getRobotList(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                robots = Robot.objects.values(
                    "id", "name", "ip", "model", "port", "cameraip"
                )
                return success_response(robots)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def robotDetail(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.GET.value:
                robot_id = request.GET.get("id")
                robot = Robot.objects.get(id=robot_id)
                robot_fields = robot.to_dict(
                    ["id", "name", "ip", "model", "port", "cameraip"]
                )
                return success_response(robot_fields)
            if request.method == HttpMethod.DELETE.value:
                data = loads(request.body)
                robot_id = data.get("id")
                robot = Robot.objects.filter(id=robot_id)
                robot.delete()
                return success_response()
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                robot_name = data.get("name")
                robot_ip = data.get("ip")
                robot_model = data.get("model")
                robot_port = data.get("port")
                robot_cameraip = data.get("cameraip")
                Robot.objects.create(
                    name=robot_name,
                    ip=robot_ip,
                    model=robot_model,
                    port=robot_port,
                    cameraip=robot_cameraip,
                )
                return success_response()
            if request.method == HttpMethod.PUT.value:
                data = loads(request.body)
                robot_id = data.get("id")
                robot_name = data.get("name")
                robot_ip = data.get("ip")
                robot_model = data.get("model")
                robot_port = data.get("port")
                robot_cameraip = data.get("cameraip")
                Robot.objects.filter(id=robot_id).update(
                    name=robot_name,
                    ip=robot_ip,
                    model=robot_model,
                    port=robot_port,
                    cameraip=robot_cameraip,
                )
                return success_response()
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))
