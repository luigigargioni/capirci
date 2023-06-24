from django.db import models
from django.conf import settings
from django.db.models import CharField
from django_mysql.models import ListCharField
from django.utils.timezone import now
from enum import Enum


# For update the database and create table
# python manage.py makemigrations backend && python manage.py migrate --run-syncdb


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.CharField(max_length=200, default=None, null=True, blank=True)
    last_modified = models.DateTimeField(default=now)
    shared = models.BooleanField(default=False)
    code = models.TextField(default=None, null=True, editable=True, blank=True)

    class Meta:
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "description":
                response_data[key] = self.description
            elif key == "last_modified":
                response_data[key] = self.last_modified
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "code":
                response_data[key] = self.code
        return response_data


class Object(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    keywords = ListCharField(
        base_field=CharField(max_length=50),
        size=20,
        max_length=1019,
        default=None,
        null=True,
        blank=True,
    )
    shared = models.BooleanField(default=False)
    force = models.IntegerField(default=2)
    height = models.FloatField(default=50)
    photo = models.TextField(default=None, null=True, editable=True, blank=True)
    contour = models.TextField(default=None, null=True, editable=True, blank=True)
    shape = models.TextField(default=None, null=True, editable=True, blank=True)

    class Meta:
        verbose_name_plural = "Objects"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "keywords":
                response_data[key] = self.keywords
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "force":
                response_data[key] = self.force
            elif key == "height":
                response_data[key] = self.height
            elif key == "photo":
                response_data[key] = self.photo
            elif key == "contour":
                response_data[key] = self.contour
            elif key == "shape":
                response_data[key] = self.shape
        return response_data


class robot_type(Enum):
    C = "Cobotta"
    V = "VS-060"


class Robot(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    MODEL_CHOICES = (
        (robot_type.C.name, robot_type.C.value),
        (robot_type.V.name, robot_type.V.value),
    )
    model = models.CharField(max_length=1, choices=MODEL_CHOICES)
    port = models.IntegerField(default=0)
    cameraip = models.GenericIPAddressField(default=0)

    class Meta:
        verbose_name_plural = "Robots"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "ip":
                response_data[key] = self.ip
            elif key == "model":
                response_data[key] = self.model
            elif key == "port":
                response_data[key] = self.port
            elif key == "cameraip":
                response_data[key] = self.cameraip
        return response_data


class UserRobot(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "UserRobots"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "user":
                response_data[key] = self.user
            elif key == "robot":
                response_data[key] = self.robot.id
        return response_data


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shared = models.BooleanField(default=False)
    position = models.CharField(max_length=1000)
    robot = models.ForeignKey(
        UserRobot, on_delete=models.CASCADE, default=None, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "Locations"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "position":
                response_data[key] = self.position
            elif key == "robot":
                response_data[key] = self.robot.id
        return response_data


class Action(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    point = models.CharField(max_length=10000)
    shared = models.BooleanField(default=False)
    robot = models.ForeignKey(
        UserRobot, on_delete=models.CASCADE, default=None, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "Actions"

    def __str__(self):
        return self.name

    def to_dict(self, keys):
        response_data = {}
        for key in keys:
            if key == "id":
                response_data[key] = self.id
            elif key == "name":
                response_data[key] = self.name
            elif key == "owner":
                response_data[key] = self.owner
            elif key == "point":
                response_data[key] = self.point
            elif key == "shared":
                response_data[key] = self.shared
            elif key == "robot":
                response_data[key] = self.robot.id
        return response_data
