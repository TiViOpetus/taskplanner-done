from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden
from .models import Task, TaskClass, Comment
from .forms import TaskEditForm, TaskEditModelForm
from django.contrib.auth.decorators import login_required

from rest_framework import generics
from .serializers import TaskSerializer, TaskClassSerializer
from rest_framework.permissions import IsAuthenticated

class TaskClassListAPI(generics.ListAPIView):
    queryset = TaskClass.objects.all()
    serializer_class = TaskClassSerializer
    permission_classes = [IsAuthenticated]

# Create your views here.
class TaskListAPI(generics.ListCreateAPIView):
    """
    Tehtävien hallinta-API: tehtävien listaus ja lisääminen. Kukkuluuruu
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Task.objects.all()
        return Task.objects.filter(user=user)
 
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
 
class TaskDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

def home(request):
    return redirect('task_list')

@login_required
def task_list(request):
    tasks = Task.objects.all().order_by('-priority')

    tasks_by_classes = {}
    task_classes = TaskClass.objects.all()

    for task_class_local in task_classes:
        if request.user.is_superuser or request.user.is_staff:
            tasks_by_classes[task_class_local] = Task.objects.filter(task_class=task_class_local)
        else:
            tasks_by_classes[task_class_local] = Task.objects.filter(task_class=task_class_local, user=request.user)

    print(tasks_by_classes)
    print(task_classes)
    print(tasks)

    return render(request, 'backlog/task_list.html', {'tasks': tasks, 'luokitellut_tehtavat': tasks_by_classes })
  
@login_required
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    if task.user != request.user and (request.user.is_superuser or request.user.is_staff) == False:
        return HttpResponseForbidden("Sinulla ei ole oikeuksia tarkastella tätä tehtävää")

    return render(request, 'backlog/task_details.html', {'task': task})

@login_required
def task_done(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.completed = True
    task.save()
    return redirect('task_detail', task.id) 

@login_required
def task_not_done(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.completed = False
    task.save()
    return redirect('task_detail', task.id) 

@login_required
def task_delete(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return redirect('task_list')

@login_required
def task_edit_form(request, task_id):
    task = get_object_or_404(Task, id=task_id)
 
    if request.method == "POST":
        form = TaskEditForm(request.POST)
        if form.is_valid():
            # Päivitetään tehtävän tiedot tietokantaan
            task.title = form.cleaned_data["name"]
            task.description = form.cleaned_data["description"]
            task.priority = form.cleaned_data["priority"]
            task.save()
 
            # Ohjataan takaisin tehtävän sivulle
            return redirect("task_detail", task_id=task.id)
    else:
        # Esitäytetty lomake GET-pyynnössä
        form = TaskEditForm(initial={
            "name": task.title,
            "description": task.description,
            "priority": task.priority,
        })
 
    return render(request, "backlog/task_edit_form.html", {"task": task, "form": form})

@login_required
def task_edit_model_form(request, task_id):
    task = get_object_or_404(Task, id=task_id)
 
    if request.method == "POST":
        form = TaskEditModelForm(request.POST, instance=task)
        if form.is_valid():
            task.save()
 
            return redirect("task_detail", task_id=task.id)
    else:
        form = TaskEditModelForm(instance=task)
 
    return render(request, "backlog/task_edit_form.html", {"task": task, "form": form})

@login_required
def add_comment(request, task_id):
    local_task = get_object_or_404(Task, id=task_id)

    if request.method == "POST":
        kontentti = request.POST.get('content')
        Comment.objects.create(task=local_task, user=request.user, content=kontentti)

    return redirect('task_detail', local_task.id)

@login_required
def delete_comment(request, task_id, comment_id):
    task = get_object_or_404(Task, id=task_id)
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()

    return redirect('task_detail', task_id)
