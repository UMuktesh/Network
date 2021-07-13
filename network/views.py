from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import math
from .forms import post
import json

from .models import User, Post

def pagination(p_no, total):
    if total == 0:
        return {'num_pages': 0,}, 0, 0
    page = {}
    if p_no is None or not p_no.isdigit():
        page['p_no'] = 1
    else:
        page['p_no'] = int(p_no)
    page['num_pages'] = math.ceil(total / 10)
    if page['p_no'] > page['num_pages']:
        page['p_no'] = page['num_pages']
    page['has_previous'] = False
    page['has_next'] = False
    if page['p_no'] > 1:
        page['previous_page_number'] = page['p_no'] - 1
        page['has_previous'] = True
    if page['p_no'] < page['num_pages']:
        page['next_page_number'] = page['p_no'] + 1
        page['has_next'] = True
    limit = 10 * page['p_no']
    offset = limit - 10
    return page, offset, limit


def index(request):
    total = Post.objects.all().count()
    page, x, y = pagination(request.GET.get('page'), total)
    posts = [p.json_rep(User.objects.filter(username=request.user.get_username()).first()) for p in Post.objects.all().order_by("-timestamp")[x:y]]
        
    return render(request, "network/index.html", {
        "posts": posts,
        "pagination": page,
        "form": post()
    })

@login_required
def newpost(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests allowed"}, status=400)
    form = post(request.POST)
    if form.is_valid():
        desc = form.cleaned_data["description"].rstrip()
        new = Post(description=desc, user=User.objects.get(username=request.user.get_username()))
        new.save()
        return HttpResponseRedirect(reverse('index'))
    else:
        return JsonResponse({"error": "Invalid post data"}, status=400)

@login_required
def follow(request):
    u = User.objects.get(username=request.user.get_username())
    total = Post.objects.filter(user__in = u.follow.all()).count()
    page, x, y = pagination(request.GET.get('page'), total)
    posts = [p.json_rep(u) for p in Post.objects.filter(user__in = u.follow.all()).order_by("-timestamp")[x:y]]

    return render(request, "network/index.html", {
        "posts": posts,
        "pagination": page,
        "form": post()
    })

def profile(request, username):
    u = User.objects.filter(username=username).first()
    if u is None:
        return JsonResponse({"error": "User not found"}, status=400)
    total = u.posts.count()
    page, x, y = pagination(request.GET.get('page'), total)
    liker = User.objects.filter(username=request.user.get_username()).first()
    posts = [p.json_rep(liker) for p in u.posts.all().order_by("-timestamp")[x:y]]
    loggedIn = request.user.is_authenticated

    return render(request, "network/profile.html", {
        "details": u.json_rep(not loggedIn or username == request.user.get_username(), loggedIn and u in liker.follow.all()),
        "posts": posts,
        "pagination": page
    })

@login_required
def addFollower(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    user = User.objects.get(username=request.user.get_username())
    follow = User.objects.filter(username=data.get("user")).first()
    if follow is None:
        return JsonResponse({"error": "Follow user not found."}, status=400)
    if data.get("follow"):
        if follow in user.follow.all():
            return JsonResponse({"error": "Already following this user."}, status=400)
        user.follow.add(follow)
    else:
        if follow not in user.follow.all():
            return JsonResponse({"error": "Not following this user."}, status=400)
        user.follow.remove(follow)
    return JsonResponse({"success": "success"}, status=200)

@login_required
def addLike(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    user = User.objects.get(username=request.user.get_username())
    post = Post.objects.filter(id=data.get("id")).first()
    if post is None:
        return JsonResponse({"error": "Post not found."}, status=400)
    if data.get("liked"):
        if user in post.likes.all():
            return JsonResponse({"error": "Already liked."}, status=400)
        post.likes.add(user)
    else:
        if user not in post.likes.all():
            return JsonResponse({"error": "Not yet liked."}, status=400)
        post.likes.remove(user)
    return JsonResponse({"success": "success"}, status=200)

@login_required
def edit(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    user = User.objects.get(username=request.user.get_username())
    post = Post.objects.filter(id=data.get("id")).first()
    if post is None:
        return JsonResponse({"error": "Post not found."}, status=400)
    if post.user != user:
        return JsonResponse({"error": "This post is not yours."}, status=400)
    post.description = data.get("description")
    post.save()
    return JsonResponse({"success": "success"}, status=200)

def checkUsername(request):
    data = json.loads(request.body)
    if data.get("username") == "":
        return JsonResponse({"available": False, "error": "Enter username"}, status=200)
    user = User.objects.filter(username=data.get("username")).first()
    if user is None:
        return JsonResponse({"available": True}, status=200)
    else:
        return JsonResponse({"available": False, "error": "Username already taken"}, status=200)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


