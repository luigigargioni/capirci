# Generated by Django 4.0.5 on 2022-06-22 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_action_robot_alter_location_robot_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='code',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]
