# Generated by Django 4.0.4 on 2022-08-10 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_alter_mywork_picture'),
        ('blog', '0008_alter_post_author_alter_post_background_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='tag',
            field=models.ManyToManyField(to='portfolio.tag', verbose_name='Тег'),
        ),
    ]