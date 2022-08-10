from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpRequest, HttpResponse
from json import loads

from app.utils.response import HttpMethod, invalid_request_method
from app.utils.string import get_or_default
from .utils.render_react_page import render_react_page


@login_required()
def home(request: HttpRequest) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render(request, "home.html")
    else:
        return invalid_request_method()


@login_required()
def home_view(request: HttpRequest) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render_react_page(request, "HomePage")
    else:
        return invalid_request_method()


@login_required()
def chat(request: HttpRequest, task_name: str) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render(request, "chat.html", {"taskName": task_name})
    else:
        return invalid_request_method()


@login_required()
def chat_view(request: HttpRequest, task_name: str) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render_react_page(request, "ChatPage", {"taskName": task_name})
    else:
        return invalid_request_method()


@login_required()
def task(request: HttpRequest, task_name: str) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render(request, "task.html", {"taskName": task_name})
    else:
        return invalid_request_method()


@login_required()
def task_view(request: HttpRequest, task_name: str) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        return render_react_page(request, "TaskPage", {"taskName": task_name})
    else:
        return invalid_request_method()


@csrf_exempt
def login_view(request: HttpRequest) -> HttpResponse:
    if request.method == HttpMethod.GET.value:
        logout_param = int(request.GET.get("logout", 0))
        if logout_param == 1:
            logout(request)
            return render_react_page(request, "LoginPage", {"logout": logout_param})
        return render_react_page(request, "LoginPage")
    elif request.method == HttpMethod.POST.value:
        data = loads(request.body)
        username: str = get_or_default(data["username"], "")
        password: str = get_or_default(data["password"], "")

        authError: bool = True

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            authError = False

        response = {"authError": authError}
        return JsonResponse(response)
    else:
        return invalid_request_method()
