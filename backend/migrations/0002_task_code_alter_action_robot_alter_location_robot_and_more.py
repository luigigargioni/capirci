# Generated by Django 4.0.5 on 2022-06-22 08:54

from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="code",
            field=models.BinaryField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name="action",
            name="robot",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="backend.userrobot",
            ),
        ),
        migrations.AlterField(
            model_name="location",
            name="robot",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="backend.userrobot",
            ),
        ),
        migrations.AlterField(
            model_name="object",
            name="keywords",
            field=django_mysql.models.ListCharField(
                models.CharField(max_length=50),
                default=None,
                max_length=1019,
                null=True,
                size=20,
            ),
        ),
        migrations.AlterField(
            model_name="task",
            name="description",
            field=models.CharField(default=None, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="owner",
            field=models.CharField(default=None, max_length=200, null=True),
        ),
    ]
