from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.timezone import localtime

def timeDiff(timestamp):
    s_Min = 60                               # seconds in Minute
    s_Hour = s_Min * 60                      # seconds in Hour
    s_Day = s_Hour * 24                      # seconds in day
    s_Mon = s_Day * 30                       # seconds in Month
    s_Yr = s_Day * 365                       # seconds in Year
    diff = timezone.now() - timestamp        # difference between dates.
    if diff.days == 0:
        # If the diff is less then seconds in a minute
        if diff.seconds <= 2 * s_Min:
            return str(diff.seconds) + ' seconds ago'
        # If the diff is less then seconds in a Hour
        elif diff.seconds < s_Hour:
            return str(int(diff.seconds / s_Min)) + ' minutes ago'
        # If the diff is less then seconds in a day
        elif diff.seconds < s_Day:
            return str(int(diff.seconds / s_Hour)) + ' hours ago'
    # If the diff is less then seconds in a Month
    elif diff.days == 1:
        return 'Yesterday ' + localtime(timestamp).strftime("%I:%M %p")
    else:
        return localtime(timestamp).strftime("%d %b, %Y %I:%M %p")

class User(AbstractUser):
    # pass
    follow = models.ManyToManyField("User", related_name="followers")
    UNIQUE_FIELDS = ['username',]
    # # USERNAME_FIELD = 
    def validity(self):
        return self not in follow
        
    @property
    def followersCount(self):
        if self.followers is None:
            return 0
        return self.followers.count()

    @property
    def following(self):
        if self.follow is None:
            return 0
        return self.follow.count()

    def json_rep(self, isMe, fbool):
        return  {
            'username': self.username,
            'following': self.following,
            'followersCount': self.followersCount,
            'isme': isMe,
            'follow': fbool,
        }

class Post(models.Model):
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    likes = models.ManyToManyField(User, related_name="liked")
    
    def __str__(self):
        return self.description

    @property
    def likesCount(self):
        return self.likes.count()

    def json_rep(self, liker=None):
        if liker is None:
            return  {
                'description': self.description,
                'timestamp': timeDiff(self.timestamp),
                'username': self.user.username,
                'likeCount': self.likesCount
            }
        else:
            return  {
                'id': self.id,
                'description': self.description,
                'timestamp': timeDiff(self.timestamp),
                'username': self.user.username,
                'likeCount': self.likesCount,
                'liked': liker in self.likes.all(),
                'isMine': liker == self.user
            }

