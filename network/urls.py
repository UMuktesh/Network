
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("following", views.follow, name="following"),
    path("follow", views.addFollower, name="follow"),
    path("newpost", views.newpost, name="newpost"),
    path("like", views.addLike, name="like"),
    path("edit", views.edit, name="edit"),
    path("check", views.checkUsername, name="check"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
