import datetime
import pytz
from django.db.models import Q
from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from .main_dialog import *
from django.core import serializers
from .XML_utilities import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from pythonping import ping
import pythoncom
import xml.etree.ElementTree as ET
import json
import win32com.client
import numpy as np
from django.views.decorators.cache import never_cache

from prova.robot_functions import *

# Create your views here.


# VIEWS -- VIEWS -- VIEWS -- VIEWS -- VIEWS
@never_cache
@login_required(login_url='/accounts/login/')
def home(request):
    template_name = 'prova/home.html'
    return render(request, template_name)

@never_cache
@login_required(login_url='/accounts/login/')
def chat(request, taskName):
    template_name = 'prova/chat.html'
    return render(request, template_name, {'taskName': taskName})

@never_cache
@login_required(login_url='/accounts/login/')
def task(request, taskName):
    template_name = 'prova/task.html'
    return render(request, template_name, {'taskName': taskName})


# VIEWS -- VIEWS -- VIEWS -- VIEWS -- VIEWS


# FUNCTION -- FUNCTION -- FUNCTION -- FUNCTION -- FUNCTION
def getTaskList(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        tasks = Task.objects.filter(Q(owner=username) | Q(shared=True))
        qs_json = serializers.serialize('json', tasks)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def checkTaskName(request):
    if request.method == 'POST':
        data_result = {'nameExist': False}
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        taskname = request.POST.get('taskname')
        if shared == 'True':
            tasks = Task.objects.filter(name=taskname)
        else:
            tasks = Task.objects.filter(Q(owner=username) | Q(shared=True)).filter(name=taskname)

        if tasks:
            data_result['nameExist'] = True
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR: checkTaskName')


def checkTaskNameModify(request):
    if request.method == 'POST':
        data_result = {'nameExist': False}
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        taskname = request.POST.get('taskname')
        thisTask = Task.objects.get(owner=username, name=taskname)
        if shared == 'True':
            tasks = Task.objects.exclude(pk=thisTask.pk).filter(name=taskname)
        else:
            tasks = Task.objects.filter(Q(owner=username) | Q(shared=True)).filter(name=taskname).exclude(pk=thisTask.pk)

        if tasks:
            data_result['nameExist'] = True
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR: checkTaskName')


def getUserIdFromUsername(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.filter(username=username)
        qs_json = serializers.serialize('json', user)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getUsernameFromUserId(request):
    if request.method == 'POST':
        userpk = request.POST.get('userpk')
        user = User.objects.filter(pk=userpk)
        qs_json = serializers.serialize('json', user)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getUserList(request):
    if request.method == 'POST':
        users = User.objects.all()
        qs_json = serializers.serialize('json', users)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getRobotList(request):
    if request.method == 'POST':
        robots = Robot.objects.all()
        qs_json = serializers.serialize('json', robots)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getObjectList(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        objects = Object.objects.filter(Q(owner=user) | Q(shared=True))
        qs_json = serializers.serialize('json', objects)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getLocationList(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        locations = Location.objects.filter(Q(owner=user) | Q(shared=True))
        qs_json = serializers.serialize('json', locations)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def getActionList(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        actions = Action.objects.filter(Q(owner=user) | Q(shared=True))
        qs_json = serializers.serialize('json', actions)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def deleteUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        instance = User.objects.get(username=username)
        instance.delete()
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def deleteLocation(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        name = request.POST.get('name')
        user = User.objects.get(username=username)
        instance = Location.objects.get(name=name, owner=user)
        instance.delete()
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def deleteAction(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        name = request.POST.get('name')
        user = User.objects.get(username=username)
        instance = Action.objects.get(name=name, owner=user)
        instance.delete()
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def deleteRobot(request):
    if request.method == 'POST':
        robotname = request.POST.get('robotname')
        instance = Robot.objects.get(name=robotname)
        instance.delete()
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def deleteMyRobot(request):
    if request.method == 'POST':
        robotname = request.POST.get('robotname')
        instance = UserRobot.objects.get(name=robotname)
        instance.delete()
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def checkEditMyRobot(request):
    if request.method == 'POST':
        response = {}
        robotnameOld = request.POST.get('robotnameOld')
        robotnameNew = request.POST.get('robotnameNew')
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        robotOld = UserRobot.objects.get(name=robotnameOld)

        if UserRobot.objects.exclude(pk=robotOld.pk).filter(name=robotnameNew).filter(user=user.pk).count() > 0:
            response['nameExist'] = True
        else:
            response['nameExist'] = False

        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponse('ERROR')


def editRobot(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        robotname = request.POST.get('name')
        robotip = request.POST.get('IP')
        robotmodel = request.POST.get('model')
        robotport = request.POST.get('port')
        camera = request.POST.get('camera')
        Robot.objects.filter(pk=id).update(name=robotname, ip=robotip, model=robotmodel, port=robotport, cameraip=camera)
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def editMyRobot(request):
    if request.method == 'POST':
        robotnameOld = request.POST.get('robotnameOld')
        robotnameNew = request.POST.get('robotnameNew')
        robotOld = UserRobot.objects.get(name=robotnameOld)
        UserRobot.objects.filter(pk=robotOld.pk).update(name=robotnameNew)
        return HttpResponse("Ok")
    else:
        return HttpResponse('ERROR')


def deleteObject(request):
    if request.method == 'POST':
        objectname = request.POST.get('name')
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        instance = Object.objects.filter(name=objectname).filter(owner=user.pk)
        instance.delete()
        os.remove("prova\\static\\prova\\images\\objects\\" + username + "_" + objectname + ".png")
        os.remove("prova\\static\\prova\\images\\objects\\" + username + "_" + objectname + "_contour.png")
        os.remove("prova\\static\\prova\\images\\objects\\" + username + "_" + objectname + "_shape.png")
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def deleteTask(request):
    if request.method == 'POST':
        taskname = request.POST.get('name')
        username = request.POST.get('username')
        instance = Task.objects.filter(name=taskname).filter(owner=username)
        instance.delete()
        taskname = str(username) + "_" + taskname
        if os.path.exists(taskname + ".txt"):
            os.remove(taskname + ".txt")
        if os.path.exists(taskname + ".xml"):
            os.remove(taskname + ".xml")
        if os.path.exists(taskname + ".pkl"):
            os.remove(taskname + ".pkl")
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def checkPassword(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('oldPassword')
        user = User.objects.get(username=username)
        success = user.check_password(password)
        return HttpResponse(success)
    else:
        return HttpResponse('ERROR')


def getMyRobotList(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        userrobot = UserRobot.objects.filter(user=user.pk)
        qs_json = serializers.serialize('json', userrobot)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def checkConnectionRobot(request):
    if request.method == 'POST':
        pk_robot = request.POST.get("code")
        ip_robot_count = Robot.objects.filter(pk=pk_robot).values_list("ip", flat=True).count()
        if ip_robot_count == 0:
            return HttpResponse('NoRobot')
        ip_robot = Robot.objects.filter(pk=pk_robot).values_list("ip", flat=True)
        ResponseList = ping(ip_robot[0], count=1)
        if ResponseList.responses[0].success is True:
            return HttpResponse(True)
        else:
            return HttpResponse(False)
    else:
        return HttpResponse('ERROR')


def pkRobotToModel(request):
    if request.method == 'POST':
        robot_pk = request.POST.get('pk')
        model = Robot.objects.filter(pk=robot_pk)
        qs_json = serializers.serialize('json', model)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def MyNewRobot(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('oldPassword')
        user = User.objects.get(username=username)
        success = user.check_password(password)
        return HttpResponse(success)
    else:
        return HttpResponse('ERROR')


def checkUser(request):
    if request.method == 'POST':
        response = {}
        username = request.POST.get('username')
        if User.objects.filter(username=username).count() > 0:
            response['usernameExist'] = True
        else:
            response['usernameExist'] = False
        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponse('ERROR')


def checkRobot(request):
    if request.method == 'POST':
        response = {}
        name = request.POST.get('name')
        IP = request.POST.get('IP')
        if Robot.objects.filter(name=name).count() > 0:
            response['nameExist'] = True
        else:
            response['nameExist'] = False

        if Robot.objects.filter(ip=IP).count() > 0:
            response['IPExist'] = True
        else:
            response['IPExist'] = False
        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponse('ERROR')


def checkMyRobot(request):
    if request.method == 'POST':
        response = {}
        name = request.POST.get('name')
        robotpk = request.POST.get('robotpk')
        username = request.POST.get('username')
        pkUser = User.objects.get(username=username)

        if Robot.objects.filter(pk=robotpk).count() > 0:
            response['robotExist'] = True
        else:
            response['robotExist'] = False

        if UserRobot.objects.filter(name=name).filter(user=pkUser).count() > 0:
            response['nameExist'] = True
        else:
            response['nameExist'] = False

        if UserRobot.objects.filter(robot=robotpk).filter(user=pkUser).count() > 0:
            response['robotAssigned'] = True
        else:
            response['nameAssigned'] = False

        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponse('ERROR')


def createMyNewRobot(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        robotpk = request.POST.get('robotpk')
        username = request.POST.get('username')
        robot = Robot.objects.get(pk=robotpk)
        user = User.objects.get(username=username)
        UserRobot.objects.create(name=name, user=user, robot=robot)
        return HttpResponse("Ok")
    else:
        return HttpResponse('ERROR')


def checkEditRobot(request):
    if request.method == 'POST':
        response = {}
        id = request.POST.get('id')
        name = request.POST.get('name')
        IP = request.POST.get('IP')
        if Robot.objects.exclude(pk=id).filter(name=name).count() > 0:
            response['nameExist'] = True
        else:
            response['nameExist'] = False

        if Robot.objects.exclude(pk=id).filter(ip=IP).count() > 0:
            response['IPExist'] = True
        else:
            response['IPExist'] = False
        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        return HttpResponse('ERROR')


def changePassword(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('newPassword')
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        return HttpResponse("oki")
    else:
        return HttpResponse('ERROR')


def createNewUser(request):
    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("newPassword")
        role = request.POST.get("role")
        user = User.objects.create_user(username=username, password=password)
        group = Group.objects.get(name=role)
        group.user_set.add(user)
        return HttpResponse("Oki")
    else:
        return HttpResponse('ERROR')


def createNewRobot(request):
    if request.method == 'POST':
        name = request.POST.get("name")
        IP = request.POST.get("IP")
        model = request.POST.get("model")
        port = request.POST.get("port")
        camera = request.POST.get("camera")
        Robot.objects.create(name=name, ip=IP, model=model, port=port, cameraip=camera)
        return HttpResponse("Oki")
    else:
        return HttpResponse('ERROR')


def takeShot(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            robot_name = request.POST.get('robot_name')
            object = request.POST.get('object_name')
            pythoncom.CoInitialize()
            user = User.objects.get(username=username)
            myRobot = UserRobot.objects.filter(user=user).filter(name=robot_name)
            robot = Robot.objects.filter(name=myRobot[0].robot)
            handles = connect(robot[0].ip, robot[0].port, 14400)
            client = handles[0]
            hCtrl = handles[1]
            hRobot = handles[2]
            client.robot_move(hRobot, 1,
                              "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)",
                              "SPEED=100")
            disconnect(client, hCtrl, hRobot)
            image = take_img(wb=True, cameraip=robot[0].cameraip)
            cv2.imwrite("prova\\static\\prova\\images\\objects\\" + str(username) + "_" + str(object) + ".png", image)

            shifted = cv2.pyrMeanShiftFiltering(image, 51, 71)
            gray = cv2.cvtColor(shifted, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
            (cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

            areaMax = 0
            areaMaxi = -1

            for i, cnt in enumerate(cnts):
                area = cv2.contourArea(cnt)
                if areaMax < area:
                    areaMax = area
                    areaMaxi = i

            copy = image.copy()
            cv2.drawContours(copy, cnts, areaMaxi, (0, 0, 255), 3)
            cv2.imwrite("prova\\static\\prova\\images\\objects\\" + str(username) + "_" + str(object) + "_contour.png",
                        copy)

            outline = np.zeros(image.shape, dtype="uint8")
            (x, y, width, height) = cv2.boundingRect(cnts[areaMaxi])
            cv2.drawContours(outline, cnts, areaMaxi, (255, 255, 255), -1)
            roi = outline[y:y + height, x:x + width]
            roi = cv2.copyMakeBorder(roi, 15, 15, 15, 15, cv2.BORDER_CONSTANT, value=0)
            cv2.imwrite("prova\\static\\prova\\images\\objects\\" + str(username) + "_" + str(object) + "_shape.png",
                        roi)

            return HttpResponse('Ok')

        except Exception as e:
            return HttpResponse(type(e).__name__)
    else:
        return HttpResponse('ERROR')


def robotOfUser(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        robots = UserRobot.objects.filter(user=user)
        qs_json = serializers.serialize('json', robots)
        return HttpResponse(qs_json, content_type="application/json")
    else:
        return HttpResponse('ERROR')


def objectExist(request):
    if request.method == 'POST':
        data_result = {'keywordExist': False, 'nameExist': False}
        object_name = request.POST.get('object')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        user = User.objects.get(username=username)
        if shared == 'True':
            objects = Object.objects.filter(name=object_name)
        else:
            objects = Object.objects.filter(Q(owner=user) | Q(shared=True)).filter(name=object_name)

        if objects:
            data_result['nameExist'] = True

        objectsOfUser = Object.objects.filter(Q(owner=user) | Q(shared=True))

        for object in objectsOfUser:
            keywords = object.keywords
            keywordsList = str(keywords).replace('[', '').replace(']', '').replace('\'', '').replace(' ', '')
            keywordsList = keywordsList.split(",")
            for keyword in keywordsList:
                if keyword == object_name:
                    data_result['keywordExist'] = True
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def keywordExist(request):
    if request.method == 'POST':
        data_result = {}
        keywordsFound = []
        keywords = request.POST.get('keywords')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        user = User.objects.get(username=username)

        if shared == 'True':
            objectsOfUser = Object.objects.all()
        else:
            objectsOfUser = Object.objects.filter(Q(owner=user) | Q(shared=True))

        for object in objectsOfUser:
            keywordsOld = object.keywords
            keywordsOld = str(keywordsOld).replace('[', '').replace(']', '').replace('\'', '').replace(' ', '')
            keywordsOld = keywordsOld.split(",")
            keywordsNew = keywords.split(",")
            for keywordOld in keywordsOld:
                for keywordNew in keywordsNew:
                    if keywordNew == keywordOld:
                        keywordsFound.append(keywordNew)
                        data_result['keywordFound'] = keywordsFound
                        data_result['keywordExist'] = True
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def keywordExistSaveChanges(request):
    if request.method == 'POST':
        data_result = {}
        keywordsFound = []
        keywords = request.POST.get('keywords')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        object = request.POST.get('object')
        user = User.objects.get(username=username)

        if shared == 'True':
            objectsOfUser = Object.objects.exclude(name=object)
        else:
            objectsOfUser = Object.objects.filter(Q(owner=user) | Q(shared=True)).exclude(name=object)

        for object in objectsOfUser:
            keywordsOld = object.keywords
            keywordsOld = str(keywordsOld).replace('[', '').replace(']', '').replace('\'', '').replace(' ', '')
            keywordsOld = keywordsOld.split(",")
            keywordsNew = keywords.split(",")
            for keywordOld in keywordsOld:
                for keywordNew in keywordsNew:
                    if keywordNew == keywordOld:
                        keywordsFound.append(keywordNew)
                        data_result['keywordFound'] = keywordsFound
                        data_result['keywordExist'] = True
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def objectSaveChanges(request):
    if request.method == 'POST':
        keywords = request.POST.get('keywords')
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        object = request.POST.get('object')
        shared = False
        if request.POST.get('shared') == 'True':
            shared = True
        force = request.POST.get('force')
        height = request.POST.get('height')
        Object.objects.filter(name=object).filter(owner=user).update(shared=shared, keywords=keywords, force=force, height=height)
        return HttpResponse('OK')
    else:
        return HttpResponse('ERROR')


def saveObject(request):
    if request.method == 'POST':
        keywords = request.POST.get('keywords')
        username = request.POST.get('username')
        user = User.objects.get(username=username)
        object_name = request.POST.get('object')
        shared = request.POST.get('shared')
        force = request.POST.get('force')
        height = request.POST.get('height')
        Object.objects.create(name=object_name, owner=user, keywords=keywords, shared=shared, force=force, height=height)
        return HttpResponse('OK')
    else:
        return HttpResponse('ERROR')


def modifyTask(request):
    if request.method == 'POST':
        taskname = request.POST.get('taskname')
        shared = request.POST.get('shared')
        timezone = pytz.timezone('Europe/Rome')
        date = timezone.localize(datetime.datetime.now())
        date.strftime('%H:%M %d-%m-%Y')
        Task.objects.filter(name=taskname).update(shared=shared, last_modified=date)
        return HttpResponse('OK')
    else:
        return HttpResponse('ERROR')


def takePositionLocation(request):
    if request.method == 'POST':
        try:
            user = request.POST.get('user')
            robotname = request.POST.get('robotname')
            if str(robotname).isdigit():
                robot = UserRobot.objects.get(pk=robotname)
                robot = Robot.objects.filter(name=robot.robot)
            else:
                robot = UserRobot.objects.filter(user=user).filter(name=robotname)
                robot = Robot.objects.filter(name=robot[0].robot)
            (client, hCtrl, hRobot) = connect(robot[0].ip, robot[0].port, 14400)
            curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
            position = {
                "X": '' + str(curr_pos[0]) + '',
                "Y": '' + str(curr_pos[1]) + '',
                "Z": '' + str(curr_pos[2]) + '',
                "RX": '' + str(curr_pos[3]) + '',
                "RY": '' + str(curr_pos[4]) + '',
                "RZ": '' + str(curr_pos[5]) + '',
                "FIG": '' + str(curr_pos[6]) + ''
            }
            json_result = json.dumps(position)
            disconnect(client, hCtrl, hRobot)
            return HttpResponse(json_result)
        except Exception as e:
            return HttpResponse(type(e).__name__)
    else:
        return HttpResponse('ERROR')


def takePositionObject(request):
    if request.method == 'POST':
        try:
            user = request.POST.get('user')
            robotname = request.POST.get('robotname')
            if str(robotname).isdigit():
                robot = UserRobot.objects.get(pk=robotname)
                robot = Robot.objects.filter(name=robot.robot)
            else:
                robot = UserRobot.objects.filter(user=user).filter(name=robotname)
                robot = Robot.objects.filter(name=robot[0].robot)
            (client, hCtrl, hRobot) = connect(robot[0].ip, robot[0].port, 14400)
            curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
            disconnect(client, hCtrl, hRobot)
            return HttpResponse(str(curr_pos[2]))
        except Exception as e:
            return HttpResponse(type(e).__name__)
    else:
        return HttpResponse('ERROR')


def takePosition(request):
    if request.method == 'POST':
        try:
            user = request.POST.get('user')
            robotname = request.POST.get('robotname')
            if str(robotname).isdigit():
                robot = UserRobot.objects.get(pk=robotname)
                robot = Robot.objects.filter(name=robot.robot)
            else:
                robot = UserRobot.objects.filter(user=user).filter(name=robotname)
                robot = Robot.objects.filter(name=robot[0].robot)
            (client, hCtrl, hRobot) = connect(robot[0].ip, robot[0].port, 14400)
            curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
            position = "::" + str(curr_pos[0]) + "," + str(curr_pos[1]) + "," + str(curr_pos[2]) + "," + str(curr_pos[3]) + "," + str(
                curr_pos[4]) + "," + str(curr_pos[5]) + "," + str(curr_pos[6]) + "::"
            disconnect(client, hCtrl, hRobot)
            return HttpResponse(position)
        except Exception as e:
            return HttpResponse(type(e).__name__)
    else:
        return HttpResponse('ERROR')


def locationExist(request):
    if request.method == 'POST':
        data_result = {'nameExist': False}
        location_name = request.POST.get('location')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        user = User.objects.get(username=username)
        if shared == 'True':
            locations = Location.objects.filter(name=location_name)
        else:
            locations = Location.objects.filter(Q(owner=user) | Q(shared=True)).filter(name=location_name)

        if locations:
            data_result['nameExist'] = True

        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def actionExist(request):
    if request.method == 'POST':
        data_result = {'nameExist': False}
        action_name = request.POST.get('action')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        user = User.objects.get(username=username)
        if shared == 'True':
            actions = Action.objects.filter(name=action_name)
        else:
            actions = Action.objects.filter(Q(owner=user) | Q(shared=True)).filter(name=action_name)

        if actions:
            data_result['nameExist'] = True

        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def locationExistModify(request):
    if request.method == 'POST':
        data_result = {'nameExist': False}
        location_name = request.POST.get('name')
        user = request.POST.get('owner')
        shared = request.POST.get('shared')
        thisLocation = Location.objects.filter(owner=user).filter(name=location_name)
        if shared == 'True':
            locations = Location.objects.exclude(pk=thisLocation[0].pk).filter(name=location_name)
        else:
            locations = Location.objects.filter(Q(owner=user) | Q(shared=True)).filter(name=location_name).exclude(pk=thisLocation[0].pk)

        if locations:
            data_result['nameExist'] = True

        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def createLocation(request):
    if request.method == 'POST':
        location_name = request.POST.get('location')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        position = request.POST.get('position')
        robot = request.POST.get('robot')
        user = User.objects.get(username=username)
        robot = UserRobot.objects.get(user=user, name=robot)
        Location.objects.create(name=location_name, owner=user, shared=shared, position=position, robot=robot)
        return HttpResponse("Ok")
    else:
        return HttpResponse('ERROR')


def createAction(request):
    if request.method == 'POST':
        action_name = request.POST.get('action')
        username = request.POST.get('username')
        shared = request.POST.get('shared')
        position = request.POST.get('positions')
        robot = request.POST.get('robot')
        user = User.objects.get(username=username)
        robot = UserRobot.objects.get(user=user, name=robot)
        Action.objects.create(name=action_name, owner=user, shared=shared, point=position, robot=robot)
        return HttpResponse("Ok")
    else:
        return HttpResponse('ERROR')


def myRobotNameFromId(request):
    if request.method == 'POST':
        robot = request.POST.get('robot')
        robot_name = UserRobot.objects.get(pk=robot)
        result = {'robot_name': robot_name.name}
        json_result = json.dumps(result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def modifyLocation(request):
    if request.method == 'POST':
        position = request.POST.get('position')
        user = request.POST.get('owner')
        name = request.POST.get('name')
        shared = request.POST.get('shared')
        Location.objects.filter(name=name).filter(owner=user).update(shared=shared, position=position)
        return HttpResponse('OK')
    else:
        return HttpResponse('ERROR')


def deleteImageObject(request):
    if request.method == 'POST':
        object_owner = request.POST.get('object_owner')
        object_name = request.POST.get('object_name')
        dir = 'prova\\static\\prova\\images\\objects'
        files = os.listdir(dir)
        for file in files:
            if file.startswith(object_owner + "_" + object_name):
                os.remove(os.path.join(dir, file))
        return HttpResponse('OK')
    else:
        return HttpResponse('ERROR')


# -------- CHAT -----

def getTaskFile(request):
    if request.method == 'POST':
        taskToSend = request.POST.get('fileName', '')
        username = request.POST.get('username', '')
        taskToSend = str(username) + "_" + taskToSend
        # prima provo ad aprire il .txt, se non c'è vuol dire che è .xml
        if os.path.exists(taskToSend + ".txt"):
            f = open(taskToSend + ".txt", "r")
            contents = f.read()
            data_result = {'file': contents, 'mode': 'txt'}
            json_result = json.dumps(data_result)
            return HttpResponse(json_result)
        else:
            if os.path.exists(taskToSend + ".xml"):
                xml = ET.parse(taskToSend + '.xml')
                parsed = parseXmlToJson(xml.getroot())
                print(parsed)
                data_result = {'file': parsed, 'mode': 'xml'}
                json_result = json.dumps(data_result)
                return HttpResponse(json_result)
            else:
                data_result = {'file': 'new'}
                json_result = json.dumps(data_result)
                return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def parseXmlToJson(xml):
    response = {}
    for child in list(xml):
        print(child.tag)
        if len(list(child)) > 0:
            if child.tag == 'repeat':
                response[child.tag] = {'times': str(child.get('times')), 'body': parseXmlToJson(child)}
                continue
                #return response
            else:
                response[child.tag] = {'body': parseXmlToJson(child)}

            if child.tag == 'event':
                if child.get('type') == 'obj':
                    response[child.tag] = {'type': child.get('type'), 'obj': child.get('obj'), 'adj': child.get('adj'), 'body': parseXmlToJson(child)}
                else:
                    response[child.tag] = {'type': child.get('type'), 'body': parseXmlToJson(child)}
            else:
                response[child.tag] = {'body': parseXmlToJson(child)}
        else:
            if child.tag == 'pick' or child.tag == 'place':
                response[child.tag] = {'card': child.get('card'), 'adj': child.get('adj'), 'obj': child.text}
            elif child.tag == 'repeat':
                response[child.tag] = {'times': child.get('times')}
            else:
                response[child.tag] = child.text or ''
    return response


'''se end=1 ho un pick place completo lo metto nel file'''


def ajaxCreateDialogue(request):
    if request.method == 'POST':
        dialogue_name = request.POST.get('dialogue_name', '')
        dialogue_owner = request.POST.get('dialogue_owner', '')
        dialogue_description = request.POST.get('dialogue_description', '')
        dialogue_shared = request.POST.get('dialogue_shared', '')
        # scrivo nel file current_dialogue il nome del programma
        deletecontent("current_dialogue.txt")
        file = open("current_dialogue.txt", "w")
        file.write(dialogue_name)
        file.close()
        # creo la nuova riga del db
        p = Task(name=dialogue_name, owner=dialogue_owner, description=dialogue_description, shared=dialogue_shared)
        p.save()
        return HttpResponse('success')
    else:
        return HttpResponse('ERROR')


# action da eseguire
def ajaxCallParserAction(request):
    print("call parser action")
    if request.method == 'POST':
        data_result = {}
        text_to_parse = request.POST.get('text')
        program_name = request.POST.get('program_name')
        files = os.listdir(".")
        for file in files:
            if file.startswith(program_name + ".pkl"):
                os.remove(os.path.join(".", file))
        response, end = main_dialog_action(text_to_parse.lower(), program_name)
        data_result['response'] = response
        data_result['end'] = end
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


# numero di volte da eseguire il task
def ajaxCallParserTimes(request):
    print("call parser condition")
    if request.method == 'POST':
        data_result = {}
        text_to_parse = request.POST.get('text', '')
        program_name = request.POST.get('program_name', '')
        # condition recognition
        response, end = main_dialog_condition(text_to_parse.lower(), program_name)
        data_result['response'] = response
        data_result['end'] = end
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


# End condition
def ajaxCallParserEnd(request):
    print("call parser END")
    if request.method == 'POST':
        data_result = {}
        text_to_parse = request.POST.get('text', '')
        program_name = request.POST.get('program_name', '')
        # condition recognition
        response, end = main_dialog_end(text_to_parse.lower(), program_name)
        data_result['response'] = response
        data_result['end'] = end
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


# Risposta affermativa?
def ajaxCallParserAssert(request):
    print("call parser ASSERT")
    if request.method == 'POST':
        data_result = {}
        text_to_parse = request.POST.get('text', '')
        program_name = request.POST.get('program_name', '')
        # condition recognition
        response, end = main_dialog_assert(text_to_parse.lower(), program_name)
        data_result['response'] = response
        data_result['end'] = end
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


# riceve l'input dell'utente verifica pickplace
def ajaxCallParser(request):
    if request.method == 'POST':
        data_result = {}
        text_to_parse = request.POST.get('text')
        username = request.POST.get('username')
        # pick place recognition
        response, end, card = main_dialog(text_to_parse.lower(), username)
        data_result['response'] = response
        data_result['end'] = end
        print('CARD '+card)
        if (not card.isnumeric() and all_sinonimi.__contains__(card)) or card == '0' or card == '':
            data_result['card'] = ''
        else:
            data_result['card'] = card
        if end == '1':
            create_XML_program(fileName, username)
            task_name_pkl = str(username) + "_" + readcontent(fileName) + ".pkl"
            if os.path.isfile(task_name_pkl):
                with open(task_name_pkl, 'rb') as input:
                    pick_place_data = pickle.load(input)
                    pick_data = pick_place_data.pick
                    # place_data = pick_place_data.place

            if pick_data.object.cardinality != '' and pick_data.object.cardinality != '0':
                if not pick_data.object.cardinality.isnumeric() and all_sinonimi.__contains__(pick_data.object.cardinality):
                    add_external_tag_XML(str(username) + "_" + readcontent(fileName), 'repeat', 'while')
                    data_result['card'] = 'while'
                elif pick_data.object.cardinality.isnumeric():
                    add_external_tag_XML(str(username) + "_" + readcontent(fileName), 'repeat', pick_data.object.cardinality)
        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def getHtmlText(request):
    if request.method == 'POST':
        taskToSave = request.POST.get('fileName', '')
        taskText = request.POST.get('text', '')
        taskOwner = request.POST.get('username', '')
        f = open(taskOwner + "_" + taskToSave + ".xml", "w+")
        f.write(taskText)
        f.close()
        timezone = pytz.timezone('Europe/Rome')
        date = timezone.localize(datetime.datetime.now())
        date.strftime('%H:%M %d-%m-%Y')
        Task.objects.filter(name=taskToSave).filter(owner=taskOwner).update(last_modified=date)
        return HttpResponse('oki')
    else:
        return HttpResponse('ERROR')


def checkLibrariesXML(request):
    if request.method == 'POST':
        data_result = {'pickExist': False, 'placeExist': False, 'actionExist': False}
        fileName = request.POST.get('fileName')
        username = request.POST.get('username')
        file = ET.parse(fileName).getroot()
        if file.find('event') is None:
            search = 'repeat/'
        else:
            search = 'event/repeat/'
        pick = file.find(search + '/pick').text
        place = file.find(search + '/place').text
        action = file.find(search + '/action')
        if action is not None:
            action = action.text
        else:
            data_result['actionExist'] = True

        data_result['pick'] = pick
        data_result['place'] = place
        data_result['action'] = action
        user = User.objects.get(username=username)

        objectUser = Object.objects.filter(Q(owner=user) | Q(shared=True))
        for object in objectUser:
            if pick == object.name:
                data_result['pickExist'] = True
                break
            keywords = object.keywords
            keywords = str(keywords).replace('[', '').replace(']', '').replace('\'', '').replace(' ', '')
            keywords = keywords.split(",")
            for keyword in keywords:
                if pick == keyword:
                    data_result['pickExist'] = True
                    break

        objectPlace = Location.objects.filter(Q(owner=user) | Q(shared=True))
        for object in objectPlace:
            if place == object.name:
                data_result['placeExist'] = True
                break

        if action is not None:
            objectAction = Action.objects.filter(Q(owner=user) | Q(shared=True))
            for object in objectAction:
                if action == object.name:
                    data_result['actionExist'] = True
                    break

        json_result = json.dumps(data_result)
        return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def runTask(request):
    if request.method == 'POST':
        try:

            taskName = request.POST.get('taskName')
            username = request.POST.get('username')
            robot = request.POST.get('robot')
            user = User.objects.get(username=username)
            userRobot = UserRobot.objects.filter(user=user).filter(name=robot)
            robot = Robot.objects.get(name=userRobot[0].robot)
            ip = robot.ip
            port = robot.port
            camera = robot.cameraip

            pythoncom.CoInitialize()
            eng = win32com.client.Dispatch("CAO.CaoEngine")
            ctrl = eng.Workspaces(0).AddController("", "CaoProv.DENSO.RC8", "", "Server=" + str(ip))
            caoRobot = ctrl.AddRobot("robot0", "")

            data_result = {'pickExist': False, 'placeExist': False, 'actionExist': False, 'objectNotFound': None, 'finishTask': None}
            place_position = None
            action_point = None
            action_position = None
            force = None

            fileName = username + "_" + taskName + ".xml"
            file = ET.parse(fileName).getroot()

            if file.find('event') is None:
                search = 'repeat/'
                times = file.find('repeat').get("times")
            else:
                search = 'event/repeat/'
                times = file.find('event/repeat').get("times")

            pick = file.find(search + 'pick').text
            place = file.find(search + 'place').text
            action = file.find(search + 'action')
            if action is not None:
                action = action.text

            pickExist = False
            objectUser = Object.objects.filter(Q(owner=user) | Q(shared=True))
            for object in objectUser:
                if pick == object.name:
                    pickExist = True
                    data_result['pickExist'] = True
                    force = object.force
                    height = object.height
                    break
                keywords = object.keywords
                keywords = str(keywords).replace('[', '').replace(']', '').replace('\'', '').replace(' ', '')
                keywords = keywords.split(",")
                for keyword in keywords:
                    if pick == keyword:
                        pickExist = True
                        data_result['pickExist'] = True
                        pick = object.name
                        force = object.force * 8
                        break

            placeExist = False
            objectPlace = Location.objects.filter(Q(owner=user) | Q(shared=True))
            for object in objectPlace:
                if place == object.name:
                    placeExist = True
                    data_result['placeExist'] = True
                    place_position = object.position
                    break

            actionExist = None
            data_result['actionExist'] = None
            if action is not None:
                actionExist = False
                data_result['actionExist'] = False
                objectAction = Action.objects.filter(Q(owner=user) | Q(shared=True))
                for object in objectAction:
                    if action == object.name:
                        actionExist = True
                        data_result['actionExist'] = True
                        action_point = object.point
                        break

            if (actionExist is not None and not actionExist) or not pickExist or not placeExist:
                json_result = json.dumps(data_result)
                return HttpResponse(json_result)

            place_position = json.loads(place_position)  # Can access with: place_position['X'], place_position['Y'],... Z, RX, RY, RZ, FIG

            if action is not None:
                action_point = action_point.split("::")
                action_point = action_point[1:-1]
                action_position = []
                i = 0
                while i < len(action_point):
                    action_position.append(action_point[i])
                    i = i + 2

            (client, hCtrl, hRobot) = connect(ip, port, 14400)

            # Move to calibration position
            client.robot_move(hRobot, 1,
                              "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)",
                              "SPEED=100")
            switch_bcap_to_orin(client, hRobot, caoRobot)
            ctrl.Execute("HandMoveA", [30, 25])  # Open hand for release object. HandMoveA (apertura in mm, velocità)
            switch_orin_to_bcap(client, hRobot, caoRobot)

            if times != 'while':
                times = int(times)
            else:
                times = math.inf

            data_result['objectNotFound'] = False
            data_result['finishTask'] = False

            i = 0
            lastFind = 0
            while i < times:
                find, lastFind = search_object(client, hRobot, username, pick, force, lastFind, camera, height, ip)

                if find:
                    i = i + 1

                    curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
                    curr_pos[2] = '254.99815172770593'
                    client.robot_move(hRobot, 2, list_to_string_position(curr_pos), "SPEED=50")

                    # Move to calibration position
                    client.robot_move(hRobot, 1,
                                      "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)",
                                      "SPEED=100")

                    if action is not None:
                        for x in range(0, len(action_position)):
                            client.robot_move(hRobot, 1,
                                              "@0 P(" + action_position[x] + ")",
                                              "SPEED=100")

                    # Move to calibration position
                    client.robot_move(hRobot, 1,
                                      "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)",
                                      "SPEED=100")

                    client.robot_move(hRobot, 1,
                                      "@0 P(" + str(place_position['X']) + ", " + str(place_position['Y']) + ", " + str(
                                          place_position['Z']) + ", " + str(place_position[
                                                                                'RX']) + ", " + str(place_position['RY']) + ", " + str(
                                          place_position['RZ']) + ", " + str(place_position["FIG"]) + ")",
                                      "SPEED=100")

                    switch_bcap_to_orin(client, hRobot, caoRobot)
                    ctrl.Execute("HandMoveA", [30, 25])  # Open hand for release object. HandMoveA (apertura in mm, velocità)
                    switch_orin_to_bcap(client, hRobot, caoRobot)
                else:
                    data_result['objectNotFound'] = True
                    break
            # Move to calibration position
            client.robot_move(hRobot, 1,
                    "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)",
                    "SPEED=100")
            disconnect(client, hCtrl, hRobot)
            if data_result['objectNotFound'] is False:
                data_result['finishTask'] = True

            json_result = json.dumps(data_result)
            return HttpResponse(json_result)
        except Exception as e:
            data_result = {'exception': type(e).__name__, "codeException": str(e)}
            json_result = json.dumps(data_result)
            return HttpResponse(json_result)
    else:
        return HttpResponse('ERROR')


def search_object(client, hRobot, username, object_name, force, lastFind, camera, objectHeight, ip):
    DISTANCE_MAX = 0.075
    DIFF_AREA_MAX = 40000
    move = 0
    find = False
    pos = lastFind

    # Quadranti usati per cercare oggetto
    Q0 = "@0 P(177.483268825558, -44.478627592948996, 254.99815172770593, -179.98842099994923, 0, 179.99584205147127, 261.0)"
    Q1 = "@0 P(124.8479084757812, 96.71132432510223, 254.93505849932905, 179.98326477675423, -0.021660598353600596, 179.9971873030206, 261.0)"
    Q2 = "@0 P(201.62729889242553, 96.71465770886049, 254.9352502844515, 179.98348831787996, -0.021534861588810798, 179.99838567272027, 261.0)"
    Q3 = "@0 P(222.45008156262494, -28.895388040937206, 254.9197279214668, 179.9806000045344, -0.029053337503689936, 179.98516581416754, 261.0)"
    Q4 = "@0 P(217.31049652044388, -130.24508774032034, 254.89685566528902, 179.9716479887839, -0.03128951339508686, 179.98066547808395, 261.0)"
    Q5 = "@0 P(133.63413919141982, -131.393237172843, 254.87885013312, 179.9599341526348, -0.027773416827480392, 179.97129867455095, 261.0)"
    Q = [Q0, Q1, Q2, Q3, Q4, Q5]

    eng = win32com.client.Dispatch("CAO.CaoEngine")
    ctrl = eng.Workspaces(0).AddController("", "CaoProv.DENSO.RC8", "", "Server=" + str(ip))
    caoRobot = ctrl.AddRobot("robot0", "")

    original = cv2.imread("prova\\static\\prova\\images\\objects\\" + username + "_" + object_name + "_shape.png", cv2.IMREAD_GRAYSCALE)
    (cnts, _) = cv2.findContours(original.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
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
        (cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

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

        outline = np.zeros(test.shape, dtype="uint8")
        (x, y, width, height) = cv2.boundingRect(cnts[areaMaxi])
        cv2.drawContours(outline, cnts, areaMaxi, (255, 255, 255), -1)
        roi = outline[y:y + height, x:x + width]
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

            (shape_x, shape_y) = polar_to_robot_coordinates(angle, curr_x, curr_y, module)
            curr_pos = robot_getvar(client, hRobot, "@CURRENT_POSITION")
            curr_pos[0] = shape_x
            curr_pos[1] = shape_y
            client.robot_move(hRobot, 2, list_to_string_position(curr_pos), "SPEED=100")

            curr_pos[2] = objectHeight
            client.robot_move(hRobot, 2, list_to_string_position(curr_pos), "SPEED=50")

            switch_bcap_to_orin(client, hRobot, caoRobot)
            ctrl.Execute("HandMoveH", [force * 6, 1])  # HandMoveH (forza (min 6, max 20), direzione (1 chiusura)
            switch_orin_to_bcap(client, hRobot, caoRobot)
            break
        else:
            move = move + 1
            pos = pos + 1
            if pos == 6:
                pos = 0
    return find, pos
