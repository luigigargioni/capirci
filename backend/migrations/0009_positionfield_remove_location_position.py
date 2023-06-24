# Generated by Django 4.2.2 on 2023-06-24 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0008_rename_point_action_positions"),
    ]

    operations = [
        migrations.CreateModel(
            name="PositionField",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("X", models.FloatField(default=0)),
                ("Y", models.FloatField(default=0)),
                ("Z", models.FloatField(default=0)),
                ("RX", models.FloatField(default=0)),
                ("RY", models.FloatField(default=0)),
                ("RZ", models.FloatField(default=0)),
                ("FIG", models.FloatField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name="location",
            name="position",
        ),
    ]
