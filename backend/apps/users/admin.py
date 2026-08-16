from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = ('username', 'email', 'full_name', 'is_admin', 'is_active', 'is_staff')

    search_fields = ('username', 'email', 'full_name')
 
    list_filter = ('is_admin', 'is_active', 'is_staff')

    list_editable = ('is_admin', 'is_active')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Личная информация', {'fields': ('full_name', 'email')}),
        ('Права доступа', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
    )