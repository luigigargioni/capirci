from django.urls import path, include
import views

urlpatterns = [
    path("", views.home, name="home"),
    path("chat/<str:taskName>/", views.chat, name="chat"),
    path("task/<str:taskName>/", views.task, name="task"),
    path("ajaxCallParser/", views.ajaxCallParser, name="ajaxCallParser"),
    path("ajaxCreateDialogue/", views.ajaxCreateDialogue, name="ajaxCreateDialogue"),
    path(
        "ajaxCallParserAction/", views.ajaxCallParserAction, name="ajaxCallParserAction"
    ),
    path("getTaskList/", views.getTaskList, name="getTaskList"),
    path("getObjectList/", views.getObjectList, name="getObjectList"),
    path("getUserList/", views.getUserList, name="getUserList"),
    path("getRobotList/", views.getRobotList, name="getRobotList"),
    path("ajaxCallParserTimes/", views.ajaxCallParserTimes, name="ajaxCallParserTimes"),
    path("getTaskFile/", views.getTaskFile, name="getTaskFile"),
    path("getHtmlText/", views.getHtmlText, name="getHtmlText"),
    path("ajaxCallParserEnd/", views.ajaxCallParserEnd, name="ajaxCallParserEnd"),
    path(
        "ajaxCallParserAssert/", views.ajaxCallParserAssert, name="ajaxCallParserAssert"
    ),
    path("deleteTask/", views.deleteTask, name="deleteTask"),
    path("deleteUser/", views.deleteUser, name="deleteUser"),
    path("deleteRobot/", views.deleteRobot, name="deleteRobot"),
    path("deleteMyRobot/", views.deleteMyRobot, name="deleteMyRobot"),
    path("checkPassword/", views.checkPassword, name="checkPassword"),
    path("editRobot/", views.editRobot, name="editRobot"),
    path("checkUser/", views.checkUser, name="checkUser"),
    path("checkRobot/", views.checkRobot, name="checkRobot"),
    path("checkMyRobot/", views.checkMyRobot, name="checkMyRobot"),
    path("checkEditMyRobot/", views.checkEditMyRobot, name="checkEditMyRobot"),
    path("editMyRobot/", views.editMyRobot, name="editMyRobot"),
    path("checkEditRobot/", views.checkEditRobot, name="checkEditRobot"),
    path(
        "checkConnectionRobot/", views.checkConnectionRobot, name="checkConnectionRobot"
    ),
    path("MyNewRobot/", views.MyNewRobot, name="MyNewRobot"),
    # path('takePhotoQR/', views.takePhotoQR, name='takePhotoQR'),
    path("getMyRobotList/", views.getMyRobotList, name="getMyRobotList"),
    path("pkRobotToModel/", views.pkRobotToModel, name="pkRobotToModel"),
    path("createNewUser/", views.createNewUser, name="createNewUser"),
    path("createNewRobot/", views.createNewRobot, name="createNewRobot"),
    path("createMyNewRobot/", views.createMyNewRobot, name="createMyNewRobot"),
    path("changePassword/", views.changePassword, name="changePassword"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("robotOfUser/", views.robotOfUser, name="robotOfUser"),
    path("takeShot/", views.takeShot, name="takeShot"),
    path(
        "getUserIdFromUsername/",
        views.getUserIdFromUsername,
        name="getUserIdFromUsername",
    ),
    path("deleteObject/", views.deleteObject, name="deleteObject"),
    path("objectExist/", views.objectExist, name="objectExist"),
    path("keywordExist/", views.keywordExist, name="keywordExist"),
    path(
        "keywordExistSaveChanges/",
        views.keywordExistSaveChanges,
        name="keywordExistSaveChanges",
    ),
    path("objectSaveChanges/", views.objectSaveChanges, name="objectSaveChanges"),
    path("saveObject/", views.saveObject, name="saveObject"),
    path("modifyTask/", views.modifyTask, name="modifyTask"),
    path("checkTaskName/", views.checkTaskName, name="checkTaskName"),
    path("checkTaskNameModify/", views.checkTaskNameModify, name="checkTaskNameModify"),
    path("getLocationList/", views.getLocationList, name="getLocationList"),
    path(
        "getUsernameFromUserId/",
        views.getUsernameFromUserId,
        name="getUsernameFromUserId",
    ),
    path("takePosition/", views.takePosition, name="takePosition"),
    path(
        "takePositionLocation/", views.takePositionLocation, name="takePositionLocation"
    ),
    path("takePositionObject/", views.takePositionObject, name="takePositionObject"),
    path("locationExist/", views.locationExist, name="locationExist"),
    path("actionExist/", views.actionExist, name="actionExist"),
    path("createLocation/", views.createLocation, name="createLocation"),
    path("createAction/", views.createAction, name="createAction"),
    path("deleteLocation/", views.deleteLocation, name="deleteLocation"),
    path("deleteAction/", views.deleteAction, name="deleteAction"),
    path("myRobotNameFromId/", views.myRobotNameFromId, name="myRobotNameFromId"),
    path("locationExistModify/", views.locationExistModify, name="locationExistModify"),
    path("modifyLocation/", views.modifyLocation, name="modifyLocation"),
    path("deleteImageObject/", views.deleteImageObject, name="deleteImageObject"),
    path("getActionList/", views.getActionList, name="getActionList"),
    path("checkLibrariesXML/", views.checkLibrariesXML, name="checkLibrariesXML"),
    path("runTask/", views.runTask, name="runTask"),
]
