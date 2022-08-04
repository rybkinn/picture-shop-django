from picture_shop.settings import STATIC_URL
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from .models import CustomUser, Professions, ProfessionsCustomUser


class ProfessionsCustomUserInline(admin.TabularInline):
    model = ProfessionsCustomUser
    extra = 1
    verbose_name = 'Профессию'
    verbose_name_plural = 'Назначить профессию или пользователя'


@admin.register(Professions)
class ProfessionAdmin(admin.ModelAdmin):
    inlines = (ProfessionsCustomUserInline,)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'get_short_avatar']
    readonly_fields = ['get_short_avatar']
    inlines = (ProfessionsCustomUserInline,)

    # Add user
    add_fieldsets = (
        *UserAdmin.add_fieldsets,
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('first_name', 'last_name', 'about', 'email', 'avatar')
            }
        ),
    )

    # Edit user
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "about", "email", "avatar")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    def get_short_avatar(self, obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" width="50">')
        else:
            return mark_safe(f'<img src="{STATIC_URL}users/images/default_avatar.jpg" width="50">')

    get_short_avatar.short_description = 'Аватар'
