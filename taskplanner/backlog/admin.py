from django.contrib import admin
from .models import Task, TaskClass

# Register your models here.
admin.site.register(Task)
admin.site.register(TaskClass)