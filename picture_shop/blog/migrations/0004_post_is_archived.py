# Generated by Django 4.0.4 on 2022-07-11 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_alter_category_title_alter_post_background_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='is_archived',
            field=models.BooleanField(default=False, verbose_name='В архиве'),
        ),
    ]
