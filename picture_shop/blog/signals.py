from django.db.models.signals import post_save, post_delete
from django.dispatch.dispatcher import receiver

from PIL import Image

from .models import *


@receiver(post_save, sender=Gallery)
def create_mini_picture_in_blog_gallery(instance, created, **kwargs):
    """
    Creates a mini picture(160x160) based on the loaded one.
    """
    if created:
        img = Image.open(instance.image.path)
        if img.width > 160 or img.height > 160:
            output_size = (160, 160)
            img.thumbnail(output_size)
            length_varchar_field = 100
            file_name = '.'.join(instance.image.name.split('.')[:-1])
            file_type = '.' + instance.image.name.split('.')[-1]
            file_name_finish = file_name + "_mini" + file_type
            if len(file_name_finish) > length_varchar_field:
                number_unnecessary_letters = len(file_name_finish) - length_varchar_field
                file_path_sold = file_name.split('_')[-1]
                file_name = '_'.join(file_name.split('_')[:-1])[:-number_unnecessary_letters] + '_' + file_path_sold
                file_name_finish = file_name + "_mini" + file_type
                img.save(instance.thumbnail.storage.base_location + '/' + file_name_finish)
            else:
                img.save(instance.thumbnail.storage.base_location + '/' + file_name_finish)
            Gallery.objects.filter(image=instance.image.name).update(thumbnail=file_name_finish)


@receiver(post_delete, sender=Gallery)
def delete_pictures_in_blog_gallery(instance, **kwargs):
    """
    Deletes the selected picture and its mini counterpart.
    """
    if instance.image.name:
        instance.image.delete(False)
    else:
        raise FileNotFoundError("Not file image.")

    if instance.thumbnail.name:
        instance.thumbnail.delete(False)
    else:
        raise FileNotFoundError('Not file mini image.')
