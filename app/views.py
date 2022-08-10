from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from json import loads
from .utils.render_react_page import render_react_page
from django.views.decorators.cache import never_cache

# Create your views here.


# VIEWS -- VIEWS -- VIEWS -- VIEWS -- VIEWS
@never_cache
@login_required(login_url="/login/")
def home(request):
    template_name = "home.html"
    return render(request, template_name)


@never_cache
@login_required(login_url="/login/")
def home_new(request):
    return render_react_page(request, "HomePage")


@never_cache
@login_required(login_url="/login/")
def chat(request, taskName):
    template_name = "chat.html"
    return render(request, template_name, {"taskName": taskName})


@never_cache
@login_required(login_url="/login/")
def chat_new(request, taskName):
    return render_react_page(request, "ChatPage", {"taskName": taskName})


@never_cache
@login_required(login_url="/login/")
def task(request, taskName):
    template_name = "task.html"
    return render(request, template_name, {"taskName": taskName})


@never_cache
@login_required(login_url="/login/")
def task_new(request, taskName):
    return render_react_page(request, "GraphicPage", {"taskName": taskName})


@never_cache
@csrf_exempt
def login(request):
    if request.method == "GET":
        logout = request.GET.get("logout", 0)
        if logout == "1":
            auth_logout(request)
            return render_react_page(request, "LoginPage", {"logout": logout})
        return render_react_page(request, "LoginPage")
    elif request.method == "POST":
        data = loads(request.body)
        username = data["username"]
        password = data["password"]

        authError = True

        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            authError = False

        response = {"authError": authError}
        return JsonResponse(response)
    else:
        return HttpResponse("ERROR: login")


# VIEWS -- VIEWS -- VIEWS -- VIEWS -- VIEWS
