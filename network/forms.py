from django import forms
from .models import Post

class post(forms.Form):
    description = forms.CharField(widget=forms.Textarea, label="New Post")
    class Meta:
        model = Post
        fields = ("description",)