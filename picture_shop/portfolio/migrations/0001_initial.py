# Generated by Django 4.0.4 on 2022-06-08 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MyClient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, verbose_name='Имя и Фамилия')),
                ('working_position', models.CharField(blank=True, max_length=30, verbose_name='Должность')),
                ('photo', models.ImageField(blank=True, upload_to='photos/%Y/%m/%d/', verbose_name='Фото')),
                ('facebook', models.CharField(blank=True, max_length=50, verbose_name='Ссылка на Facebook')),
                ('twitter', models.CharField(blank=True, max_length=50, verbose_name='Ссылка на Twitter')),
                ('instagram', models.CharField(blank=True, max_length=50, verbose_name='Ссылка на Instagram')),
                ('comment', models.TextField(verbose_name='Комментарий')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
            ],
            options={
                'verbose_name': 'Мой клиент',
                'verbose_name_plural': 'Мои клиенты',
                'ordering': ['name', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='MyWork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, verbose_name='Название работы')),
                ('description', models.TextField(verbose_name='Описание')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликовано')),
            ],
            options={
                'verbose_name': 'Моя работа',
                'verbose_name_plural': 'Мои работы',
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Название тега')),
                ('slug', models.SlugField(unique=True, verbose_name='Url')),
            ],
            options={
                'verbose_name': 'Тег',
                'verbose_name_plural': 'Теги',
                'ordering': ['name'],
            },
        ),
    ]
