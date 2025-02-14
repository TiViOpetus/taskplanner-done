from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden
from .models import Task, TaskClass, Comment
from django.contrib.auth.decorators import login_required
from .forms import TaskEditForm, TaskEditModelForm
# Create your views here.
 

def home(request):
    return redirect('task_list') 

@login_required
def task_list(request):

    task_classes = TaskClass.objects.all()
    tasks_by_class = {task_class: Task.objects.filter(task_class=task_class, user=request.user) for task_class in task_classes}
    if request.user.is_superuser or request.user.is_staff:
        tasks_by_class = {task_class: Task.objects.filter(task_class=task_class) for task_class in task_classes}

    return render(request, 'backlog/task_list.html', {'tasks_by_class': tasks_by_class})

@login_required
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    
    if task.user != request.user and (request.user.is_superuser or request.user.is_staff) == False:  # 🔹 Estetään pääsy muiden tehtäviin
        return HttpResponseForbidden("Sinulla ei ole oikeuksia tarkastella tehtävää")
    return render(request, 'backlog/task_details.html', {'task': task})

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
    task.completed = False
    task.delete()
    return redirect('task_list') 

@login_required
def add_comment(request, task_id):
    task = Task.objects.get(id=task_id)
    
    if request.method == "POST":
        content = request.POST.get('content')
        Comment.objects.create(task=task, user=request.user, content=content)
        
    return redirect('task_detail', task.id)

@login_required
def delete_comment(request, task_id, comment_id):
    task = Task.objects.get(id=task_id)
    comment = task.comments.get(id=comment_id)
    comment.delete()
    return redirect('task_detail', task_id=task.id)