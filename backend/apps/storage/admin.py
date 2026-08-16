from django.contrib import admin

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = (
        'original_name',
        'user',
        'upload_date',
        'last_download_date',
        'is_deleted',
    )
    list_filter = ('is_deleted', 'upload_date', 'user')
    search_fields = ('original_name', 'user__username', 'share_link')
    readonly_fields = (
        'stored_name',
        'file_path',
        'upload_date',
        'last_download_date',
    )
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'original_name', 'comment')
        }),
        ('Данные файла', {
            'fields': ('stored_name', 'file_path', 'size')
        }),
        ('Даты', {
            'fields': ('upload_date', 'last_download_date')
        }),

        ('Удаление', {
            'fields': ('is_deleted', 'deleted_at')
        }),
    )
    

    class Meta:
        model = File

