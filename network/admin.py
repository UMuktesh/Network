from django.contrib import admin
# from django.contrib.auth.models import AbstractUser
from .models import User, Post


# Register your models here.
admin.site.register(User)
admin.site.register(Post)
# admin.site.register(AbstractUser)