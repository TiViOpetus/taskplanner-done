from django import forms
from .models import Task

class TaskEditForm(forms.Form):
    name = forms.CharField(label="Tehtävän nimi", max_length=200)
    description = forms.CharField(label="Kuvaus", widget=forms.Textarea)
    priority = forms.IntegerField(label="Prioriteetti")

class TaskEditModelForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'
        #fields = ["title", "description", "priority", "completed"]

        labels = {
            "title": "Otsikko",
            "description": "Kuvaus",
            "priority": "Prioriteetti",
            "completed": "Tila",
            "additional_info": "Lisätiedot",
        }

#django.forms.Form

#django.forms.ModelForm