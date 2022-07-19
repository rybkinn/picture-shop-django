from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'background_image', 'creation_time', 'author', 'is_archived')
    prepopulated_fields = {'slug': ('title',)}
    exclude = ('author',)
    list_editable = ['is_archived']
    list_filter = ('is_archived',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('image', 'get_thumbnail')
    exclude = ['thumbnail']

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return mark_safe(f'<img src="{obj.thumbnail.url}" width="50">')
        else:
            return '-'

    get_thumbnail.short_description = 'Миниатюра'
