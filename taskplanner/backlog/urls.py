from django.urls import path
from .views import home, task_list, task_detail, task_done, task_not_done, task_delete, task_edit_form, task_edit_model_form, add_comment, delete_comment
 
urlpatterns = [
    path('', home, name='home'),
    path('tasks/', task_list, name='task_list'),
    path('tasks/<int:task_id>/delete', task_delete, name='task_delete'),
    path('tasks/<int:task_id>/task_done', task_done, name='task_done'),
    path('tasks/<int:task_id>/task_not_done', task_not_done, name='task_not_done'),
    path('tasks/<int:task_id>/', task_detail, name='task_detail'),
    path('tasks/<int:task_id>/edit_form', task_edit_form, name='task_edit_form'),
    path('tasks/<int:task_id>/edit_model_form', task_edit_model_form, name='task_edit_model_form'),
    path('task/<int:task_id>/add_comment/', add_comment, name='add_comment'),
    path('task/<int:task_id>/comment/<int:comment_id>/delete/', delete_comment, name='delete_comment'),
]