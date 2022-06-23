from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='users/%Y/%m/%d/', default='users/avatar/default_avatar.jpg', blank=True,
                               verbose_name='Аватар')
