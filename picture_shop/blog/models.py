from django.db import models
from django.urls import reverse

from PIL import Image


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

    def save(self, *args, **kwargs):
        super(Gallery, self).save(*args, **kwargs)
        img = Image.open(self.image.path)
        if img.width > 160 or img.height > 160:
            output_size = (160, 160)
            img.thumbnail(output_size)
            length_varchar_field = 100
            file_name = '.'.join(self.image.name.split('.')[:-1])
            file_type = '.' + self.image.name.split('.')[-1]
            file_name_finish = file_name + "_mini" + file_type
            if len(file_name_finish) > length_varchar_field:
                number_unnecessary_letters = len(file_name_finish) - length_varchar_field
                file_path_sold = file_name.split('_')[-1]
                file_name = '_'.join(file_name.split('_')[:-1])[:-number_unnecessary_letters] + '_' + file_path_sold
                file_name_finish = file_name + "_mini" + file_type
                img.save(self.thumbnail.storage.base_location + '/' + file_name_finish)
            else:
                img.save(self.thumbnail.storage.base_location + '/' + file_name_finish)
            Gallery.objects.filter(image=self.image.name).update(thumbnail=file_name_finish)

    def __str__(self):
        return self.image.name.split('/')[-1]

    class Meta:
        verbose_name = 'Картинку'
        verbose_name_plural = 'Галерея'
