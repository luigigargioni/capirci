from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import HttpRequest, HttpResponse
from app.utils.response import (
    HttpMethod,
    error_response,
    invalid_request_method,
    success_response,
)
from app.utils.string import get_or_default
from .utils.render_react_page import render_react_page


def index(request):
    return render(request, "index.html")


@login_required()
def home(request: HttpRequest) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render(request, "home.html")
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@login_required()
def home_view(request: HttpRequest) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render_react_page(request, "HomePage")
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@login_required()
def chat(request: HttpRequest, task_name: str) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render(request, "chat.html", {"taskName": task_name})
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@login_required()
def chat_view(request: HttpRequest, task_name: str) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render_react_page(request, "ChatPage", {"taskName": task_name})
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@login_required()
def task(request: HttpRequest, task_name: str) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render(request, "task.html", {"taskName": task_name})
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@login_required()
def graphic_view(request: HttpRequest, task_name: str) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render_react_page(request, "GraphicPage", {"taskName": task_name})
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))


@csrf_exempt
def login_view(request: HttpRequest) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            logout_param = int(request.GET.get("logout", 0))
            if logout_param == 1:
                logout(request)
                return render_react_page(request, "LoginPage", {"logout": logout_param})
            if not request.user.is_anonymous:
                return render_react_page(request, "HomePage")
            return render_react_page(request, "LoginPage")
        elif request.method == HttpMethod.POST.value:
            username: str = get_or_default(request.POST.get("username"), "")
            password: str = get_or_default(request.POST.get("password"), "")

            authError: bool = True

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                authError = False

            data = {"authError": authError}
            return success_response(data)
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))
