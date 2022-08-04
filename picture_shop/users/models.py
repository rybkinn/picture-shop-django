from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Professions(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название профессии')

    class Meta:
        verbose_name = 'Профессию'
        verbose_name_plural = 'Профессии'

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    first_name = models.CharField(_("first name"), max_length=150)
    last_name = models.CharField(_("last name"), max_length=150)
    avatar = models.ImageField(upload_to='users/%Y/%m/%d/', blank=True, verbose_name='Аватар')
    about = models.TextField(verbose_name='О себе')
    profession = models.ManyToManyField(Professions, through='ProfessionsCustomUser',
                                        verbose_name='Профессии')


class ProfessionsCustomUser(models.Model):
    profession = models.ForeignKey(Professions, on_delete=models.PROTECT, verbose_name='Профессия')
    custom_user = models.ForeignKey(CustomUser, on_delete=models.PROTECT,
                                    verbose_name='Пользователь')
