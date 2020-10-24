from django.db import models

# Create your models here.
from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)


# Create your models here.
class Test(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=20)
    time = models.IntegerField(default=0)


class Login(models.Model):
    user = models.CharField(max_length=20)
    pwd = models.CharField(max_length=20)


class RegisterList(models.Model):
    register_user = models.CharField(max_length=20)
    register_pwd = models.CharField(max_length=20)


class VisitInformation(models.Model):
    date = models.CharField(max_length=20)
    visit_times_today = models.IntegerField(default=0)
    visit_times_all = models.IntegerField(default=0)


class LeaveMessage(models.Model):
    leave_message_username = models.CharField(max_length=20)
    leave_message_text = models.TextField()
    leave_message_time = models.CharField(max_length=20)


class Sign(models.Model):
    sign_user = models.CharField(max_length=20)
    is_sign_today = models.BooleanField(default=0)
    sign_total = models.IntegerField(default=0)
    sign_continuous = models.IntegerField(default=0)
    sign_last_time = models.CharField(max_length=20)


class SignRefresh(models.Model):
    sign_refresh_time = models.CharField(max_length=20)
