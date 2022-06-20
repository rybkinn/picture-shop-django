from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'get_short_avatar']
    readonly_fields = ['get_short_avatar']

    # Add user
    add_fieldsets = (
        *UserAdmin.add_fieldsets,
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('first_name', 'last_name', 'email', 'avatar')
            }
        )
    )

    # Edit user
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Дополнительно',
            {
                'fields': (
                    'avatar',
                )
            }
        )
    )

    def get_short_avatar(self, obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" width="50">')
        else:
            return '-'

    get_short_avatar.short_description = 'Аватар'
