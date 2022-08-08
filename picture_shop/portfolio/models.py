from django.db import models
from django.template.defaultfilters import truncatechars


class MyWork(models.Model):
    title = models.CharField(max_length=50, verbose_name='Название работы')
    description = models.TextField(verbose_name='Описание')
    picture = models.ImageField(upload_to='my_works/%Y/%m/%d/', verbose_name='Картина')
    is_published = models.BooleanField(default=True, verbose_name='Опубликовано')
    creation_time = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Мою работу'
        verbose_name_plural = 'Мои работы'
        ordering = ['title']

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название тега')
    slug = models.SlugField(max_length=50, unique=True, verbose_name='Url')
    
    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ['name']

    def __str__(self):
        return self.name


class MyClient(models.Model):
    name = models.CharField(max_length=40, verbose_name='Имя и Фамилия')
    working_position = models.CharField(max_length=30, blank=True, verbose_name='Должность')
    photo = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True, verbose_name='Фото')
    facebook = models.CharField(max_length=50, blank=True, verbose_name='Ссылка на Facebook')
    twitter = models.CharField(max_length=50, blank=True, verbose_name='Ссылка на Twitter')
    instagram = models.CharField(max_length=50, blank=True, verbose_name='Ссылка на Instagram')
    comment = models.TextField(verbose_name='Комментарий')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Моего клиента'
        verbose_name_plural = 'Мои клиенты'
        ordering = ['name', '-created_at', '-updated_at']

    def __str__(self):
        return self.name

    @property
    def short_comment(self):
        return truncatechars(self.comment, 50)
