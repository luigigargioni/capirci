from django.urls import path, re_path
from . import views
from .functions.auth import login_func, logout_func, verifyToken, changePassword
from .functions.libraries import (
    getTaskList,
    taskDetail,
    getObjectList,
    objectDetail,
    getLocationList,
    locationDetail,
    getActionList,
    actionDetail,
    getMyRobotList,
    myRobotDetail,
    takePositionLocation,
    takePointAction,
    takeObjectHeight,
)
from .functions.management import (
    getRobotList,
    robotDetail,
    getUserList,
    userDetail,
    getGroupList,
    resetPassword,
)
from . import function
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView

API = "api/"
AUTH = API + "auth/"
HOME = API + "home/"
GRAPHIC = API + "graphic/"
CHAT = API + "chat/"


urlpatterns = [
    # AUTH
    path(AUTH + "login/", login_func, name="login_func"),
    path(AUTH + "logout/", logout_func, name="logout_func"),
    path(AUTH + "verifyToken/", verifyToken, name="verifyToken"),
    path(HOME + "changePassword/", changePassword, name="changePassword"),
    # LIBRARIES
    path(HOME + "tasks/", getTaskList, name="getTaskList"),
    path(HOME + "task/", taskDetail, name="taskDetail"),
    path(HOME + "objects/", getObjectList, name="getObjectList"),
    path(HOME + "object/", objectDetail, name="objectDetail"),
    path(HOME + "locations/", getLocationList, name="getLocationList"),
    path(HOME + "location/", locationDetail, name="locationDetail"),
    path(HOME + "actions/", getActionList, name="getActionList"),
    path(HOME + "action/", actionDetail, name="actionDetail"),
    path(HOME + "myRobots/", getMyRobotList, name="getMyRobotList"),
    path(HOME + "myRobot/", myRobotDetail, name="myRobotDetail"),
    path(
        HOME + "takePositionLocation/",
        takePositionLocation,
        name="takePositionLocation",
    ),
    path(HOME + "takePointAction/", takePointAction, name="takePointAction"),
    path(HOME + "takeObjectHeight/", takeObjectHeight, name="takeObjectHeight"),
    # MANAGEMENT
    path(HOME + "robots/", getRobotList, name="getRobotList"),
    path(HOME + "robot/", robotDetail, name="robotDetail"),
    path(HOME + "users/", getUserList, name="getUserList"),
    path(HOME + "user/", userDetail, name="userDetail"),
    path(HOME + "resetPassword/", resetPassword, name="resetPassword"),
    path(HOME + "groups/", getGroupList, name="getGroupList"),
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
    path(
        "getUsernameFromUserId/",
        function.getUsernameFromUserId,
        name="getUsernameFromUserId",
    ),
    path("takePosition/", function.takePosition, name="takePosition"),
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
