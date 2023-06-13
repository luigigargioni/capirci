from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.http import HttpRequest, HttpResponse
from backend.utils.response import (
    HttpMethod,
    error_response,
    invalid_request_method,
    success_response,
)
from backend.utils.string import get_or_default


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
def chat(request: HttpRequest, task_name: str) -> HttpResponse:
    try:
        if request.method == HttpMethod.GET.value:
            return render(request, "chat.html", {"taskName": task_name})
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


@csrf_exempt
def login_view(request: HttpRequest) -> HttpResponse:
    try:
        if request.method == HttpMethod.POST.value:
            username: str = get_or_default(request.POST.get("username"), "")
            password: str = get_or_default(request.POST.get("password"), "")

            authError: bool = True

            user = authenticate(request, username=username, password=password)
            print(username)
            if user is not None:
                login(request, user)
                authError = False

            data = {"authError": authError}
            return success_response(data)
        else:
            return invalid_request_method()
    except Exception as e:
        return error_response(str(e))
