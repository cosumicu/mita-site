from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User

class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    add_form = CustomUserCreationForm
    model = User
    list_display = ['id', 'email', 'username', 'is_staff', 'is_active', 'date_joined']
    list_display_links = ['id', 'email']
    list_filter = ['is_staff', 'is_active']
    fieldsets = (
        (
            ("Login Credentials"), 
            {
                "fields": ("email", "password",)
            },
        ),
        (
            ("Personal Information"),
            {
                "fields": ("username",)
            },
        ),
        (
            ("Permissions and Groups"),
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions",)
            },
        ),
        (
            ("Important Dates"),
            {
                "fields": ("last_login", "date_joined",)
            },
        ),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "is_staff", "is_active"),
        }),
    )

    search_fields = ["email", "username"]

admin.site.register(User, UserAdmin)