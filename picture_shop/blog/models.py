from django.db import models
from django.urls import reverse


class Category(models.Model):
    title = models.CharField(max_length=255, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Url')

    class Meta:
        verbose_name = 'Категорию'
        verbose_name_plural = 'Категории'
        ordering = ['title']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('category', kwargs={'slug': self.slug})


class Post(models.Model):
    title = models.CharField(max_length=150, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='Url')
    description = models.TextField(blank=True, verbose_name='Описание')
    creation_time = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    background_image = models.ImageField(upload_to='blog_post_background/%Y/%m/%d/',
                                         default='blog_post_background/default/default_background_post.png',
                                         blank=True, verbose_name='Картинка на фоне')
    author = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True, verbose_name='Автор')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, default=None,
                                 related_name='posts', verbose_name='Категория')
    is_archived = models.BooleanField(default=False, verbose_name='В архиве')

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        ordering = ['-creation_time']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post', kwargs={'slug': self.slug})


class Gallery(models.Model):
    image = models.ImageField(upload_to='blog_gallery/%Y/%m/%d', verbose_name='Картинка')
    thumbnail = models.ImageField(upload_to='blog_gallery_mini/%Y/%m/%d', null=True, blank=True, verbose_name='Миниатюра')

    class Meta:
        verbose_name = 'Картинку'
        verbose_name_plural = 'Галерея'

    def __str__(self):
        return self.image.name.split('/')[-1]
