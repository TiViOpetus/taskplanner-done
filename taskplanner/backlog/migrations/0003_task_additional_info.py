# Generated by Django 5.1.5 on 2025-01-27 09:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backlog', '0002_task_priority'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='additional_info',
            field=models.CharField(default='', max_length=200),
        ),
    ]
