from django.urls import path, re_path
from . import views
from . import function
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView

API = "api/"
HOME = API + "home/"
GRAPHIC = API + "graphic/"
CHAT = API + "chat/"


urlpatterns = [
    # API
    path(API + "login/", views.login_view, name="login"),
    path(HOME + "tasks/", function.getTaskList, name="getTaskList"),
    # Views
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
    re_path(r"^.*$", TemplateView.as_view(template_name="base.html")),
    # OLD Views
    # path("", views.home, name="home"),
    path("chat/<str:task_name>/", views.chat, name="chat"),
    path("task/<str:task_name>/", views.task, name="task"),
    # FUNCTION -- FUNCTION -- FUNCTION -- FUNCTION -- FUNCTION
    path("ajaxCallParser/", function.ajaxCallParser, name="ajaxCallParser"),
    path("ajaxCreateDialogue/", function.ajaxCreateDialogue, name="ajaxCreateDialogue"),
    path(
        "ajaxCallParserAction/",
        function.ajaxCallParserAction,
        name="ajaxCallParserAction",
    ),
    path("getTaskList/", function.getTaskList, name="getTaskList"),
    path("getObjectList/", function.getObjectList, name="getObjectList"),
    path("getUserList/", function.getUserList, name="getUserList"),
    path("getRobotList/", function.getRobotList, name="getRobotList"),
    path(
        "ajaxCallParserTimes/", function.ajaxCallParserTimes, name="ajaxCallParserTimes"
    ),
    path("getTaskFile/", function.getTaskFile, name="getTaskFile"),
    path("getHtmlText/", function.getHtmlText, name="getHtmlText"),
    path("ajaxCallParserEnd/", function.ajaxCallParserEnd, name="ajaxCallParserEnd"),
    path(
        "ajaxCallParserAssert/",
        function.ajaxCallParserAssert,
        name="ajaxCallParserAssert",
    ),
    path("deleteTask/", function.deleteTask, name="deleteTask"),
    path("deleteUser/", function.deleteUser, name="deleteUser"),
    path("deleteRobot/", function.deleteRobot, name="deleteRobot"),
    path("deleteMyRobot/", function.deleteMyRobot, name="deleteMyRobot"),
    path("checkPassword/", function.checkPassword, name="checkPassword"),
    path("editRobot/", function.editRobot, name="editRobot"),
    path("checkUser/", function.checkUser, name="checkUser"),
    path("checkRobot/", function.checkRobot, name="checkRobot"),
    path("checkMyRobot/", function.checkMyRobot, name="checkMyRobot"),
    path("checkEditMyRobot/", function.checkEditMyRobot, name="checkEditMyRobot"),
    path("editMyRobot/", function.editMyRobot, name="editMyRobot"),
    path("checkEditRobot/", function.checkEditRobot, name="checkEditRobot"),
    path(
        "checkConnectionRobot/",
        function.checkConnectionRobot,
        name="checkConnectionRobot",
    ),
    path("MyNewRobot/", function.MyNewRobot, name="MyNewRobot"),
    # path('takePhotoQR/', function.takePhotoQR, name='takePhotoQR'),
    path("getMyRobotList/", function.getMyRobotList, name="getMyRobotList"),
    path("pkRobotToModel/", function.pkRobotToModel, name="pkRobotToModel"),
    path("createNewUser/", function.createNewUser, name="createNewUser"),
    path("createNewRobot/", function.createNewRobot, name="createNewRobot"),
    path("createMyNewRobot/", function.createMyNewRobot, name="createMyNewRobot"),
    path("changePassword/", function.changePassword, name="changePassword"),
    path("robotOfUser/", function.robotOfUser, name="robotOfUser"),
    path("takeShot/", function.takeShot, name="takeShot"),
    path(
        "getUserIdFromUsername/",
        function.getUserIdFromUsername,
        name="getUserIdFromUsername",
    ),
    path("deleteObject/", function.deleteObject, name="deleteObject"),
    path("objectExist/", function.objectExist, name="objectExist"),
    path("keywordExist/", function.keywordExist, name="keywordExist"),
    path(
        "keywordExistSaveChanges/",
        function.keywordExistSaveChanges,
        name="keywordExistSaveChanges",
    ),
    path("objectSaveChanges/", function.objectSaveChanges, name="objectSaveChanges"),
    path("saveObject/", function.saveObject, name="saveObject"),
    path("modifyTask/", function.modifyTask, name="modifyTask"),
    path("checkTaskName/", function.checkTaskName, name="checkTaskName"),
    path(
        "checkTaskNameModify/", function.checkTaskNameModify, name="checkTaskNameModify"
    ),
    path("getLocationList/", function.getLocationList, name="getLocationList"),
    path(
        "getUsernameFromUserId/",
        function.getUsernameFromUserId,
        name="getUsernameFromUserId",
    ),
    path("takePosition/", function.takePosition, name="takePosition"),
    path(
        "takePositionLocation/",
        function.takePositionLocation,
        name="takePositionLocation",
    ),
    path("takePositionObject/", function.takePositionObject, name="takePositionObject"),
    path("locationExist/", function.locationExist, name="locationExist"),
    path("actionExist/", function.actionExist, name="actionExist"),
    path("createLocation/", function.createLocation, name="createLocation"),
    path("createAction/", function.createAction, name="createAction"),
    path("deleteLocation/", function.deleteLocation, name="deleteLocation"),
    path("deleteAction/", function.deleteAction, name="deleteAction"),
    path("myRobotNameFromId/", function.myRobotNameFromId, name="myRobotNameFromId"),
    path(
        "locationExistModify/", function.locationExistModify, name="locationExistModify"
    ),
    path("modifyLocation/", function.modifyLocation, name="modifyLocation"),
    path("deleteImageObject/", function.deleteImageObject, name="deleteImageObject"),
    path("getActionList/", function.getActionList, name="getActionList"),
    path("checkLibrariesXML/", function.checkLibrariesXML, name="checkLibrariesXML"),
    path("runTask/", function.runTask, name="runTask"),
    # Home
    ############################
    # Graphic
    path(
        GRAPHIC + "getActionList/",
        function.getActionListGraphic,
        name="getActionListGraphic",
    ),
    path(
        GRAPHIC + "getObjectList/",
        function.getObjectListGraphic,
        name="getObjectListGraphic",
    ),
    path(
        GRAPHIC + "getLocationList/",
        function.getLocationListGraphic,
        name="getLocationListGraphic",
    ),
    path(
        GRAPHIC + "getTaskList/",
        function.getTaskListGraphic,
        name="getTaskListGraphic",
    ),
    # Chat
    ############################
]
