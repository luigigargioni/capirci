from enum import Enum
from django.urls import path
from . import views
from . import function

# TODO Try https://django-ninja.rest-framework.com/

API = "api/"


class PathEnum(Enum):
    HOME = API + "home/"
    GRAPHIC = API + "graphic/"
    CHAT = API + "chat/"


urlpatterns = [
    # Views
    path("home_new/", views.home_view, name="home_new"),
    path("chat_new/<str:task_name>/", views.chat_view, name="chat_new"),
    path("graphic/<str:task_name>/", views.graphic_view, name="graphic"),
    path("login/", views.login_view, name="login"),
    # OLD Views
    path("", views.home, name="home"),
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
        PathEnum.GRAPHIC.value + "getActionList/",
        function.getActionListGraphic,
        name="getActionListGraphic",
    ),
    path(
        PathEnum.GRAPHIC.value + "getObjectList/",
        function.getObjectListGraphic,
        name="getObjectListGraphic",
    ),
    path(
        PathEnum.GRAPHIC.value + "getLocationList/",
        function.getLocationListGraphic,
        name="getLocationListGraphic",
    ),
    path(
        PathEnum.GRAPHIC.value + "getTaskList/",
        function.getTaskListGraphic,
        name="getTaskListGraphic",
    ),
    # Chat
    ############################
]
