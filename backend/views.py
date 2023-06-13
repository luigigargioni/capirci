from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from django.http import HttpRequest, HttpResponse
from backend.utils.response import (
    HttpMethod,
    error_response,
    invalid_request_method,
)


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
