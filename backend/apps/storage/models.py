import os
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class File(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files', verbose_name='Владелец')
    original_name = models.CharField(max_length=255, verbose_name='Оригинальное имя')
    stored_name = models.CharField(max_length=255, unique=True, verbose_name='Имя в хранилище')
    file_path = models.CharField(max_length=500, verbose_name='Путь к файлу')
    comment = models.TextField(blank=True, default='', verbose_name='Комментарий')
    size = models.BigIntegerField(verbose_name='Размер файла (в байтах)')
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')
    last_download_date = models.DateTimeField(null=True, blank=True, verbose_name='Дата последнего скачивания')
    share_link = models.CharField(max_length=255, unique=True, blank=True, null=True, verbose_name='Ссылка для общего доступа')
    is_deleted = models.BooleanField(default=False, verbose_name='Удален')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата удаления')

    class Meta:
        db_table = 'files'
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['-upload_date']
        indexes = [models.Index(fields=['user', 'upload_date'])]

    def __str__(self):
        return f'{self.original_name} ({self.user.username})'

    @property
    def size_mb(self):
        return round(self.size / (1024 * 1024), 2)

    @property
    def is_shared(self):
        return bool(self.share_link)

    def generate_stored_name(self):
        ext = os.path.splitext(self.original_name)[1]
        return f'{uuid.uuid4().hex}{ext}'

    def generate_share_link(self):
        return uuid.uuid4().hex

    def update_last_download(self):
        self.last_download_date = timezone.now()
        self.save(update_fields=['last_download_date'])

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])