from django.contrib import admin

# Register your models here.
from .models import Action, Task, Object, Robot, UserRobot, Location


# Define which attributes are displayed in admin section


class ActionOption(admin.ModelAdmin):
    list_display = ("name", "owner", "point", "shared")


class TaskOption(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "description", "last_modified", "shared")


class ObjectOption(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "keywords", "force", "shared", "height")


class RobotOption(admin.ModelAdmin):
    list_display = ("id", "name", "ip", "model", "port", "cameraip")


class UserRobotOption(admin.ModelAdmin):
    list_display = ("id", "user", "name", "robot")


class LocationOption(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "position", "shared", "robot")


admin.site.register(Action, ActionOption)
admin.site.register(Task, TaskOption)
admin.site.register(Object, ObjectOption)
admin.site.register(Robot, RobotOption)
admin.site.register(UserRobot, UserRobotOption)
admin.site.register(Location, LocationOption)
