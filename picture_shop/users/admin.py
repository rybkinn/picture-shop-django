from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'avatar']

    # Add user
    add_fieldsets = (
        *UserAdmin.add_fieldsets,
        (
            'Дополнительно',
            {
                'fields': (
                    'avatar',
                )
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
