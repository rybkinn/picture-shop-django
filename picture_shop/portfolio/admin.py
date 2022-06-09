from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import *


@admin.register(MyWork)
class MyWorkAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'picture', 'is_published', 'get_picture')
    list_editable = ('is_published',)
    search_fields = ('title', 'description')
    list_filter = ('is_published',)

    def get_picture(self, obj):
        if obj.picture:
            return mark_safe(f'<img src="{obj.picture.url}" width="75">')
        else:
            return '-'

    get_picture.short_description = 'Миниатюра'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')


@admin.register(MyClient)
class MyClientsAdmin(admin.ModelAdmin):
    list_display = ('name', 'working_position', 'photo', 'facebook', 'twitter',
                    'instagram', 'short_comment', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
