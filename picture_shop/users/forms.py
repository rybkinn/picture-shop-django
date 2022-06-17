from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'avatar', 'groups')


class CustomUserChangeFrom(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'avatar', 'groups')
