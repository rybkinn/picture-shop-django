from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=110, verbose_name='Название')
    description = models.CharField(max_length=150, blank=True, verbose_name='Описание')
    post_time = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    background_image = models.ImageField(upload_to='blog_post_background/%Y/%m/%d/', verbose_name='Картинка на фоне')

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        ordering = ['-post_time']

    def __str__(self):
        return self.title
