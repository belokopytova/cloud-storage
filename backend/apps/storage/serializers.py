from django.conf import settings
from rest_framework import serializers

from .models import File


class FileSerializer(serializers.ModelSerializer):
    size_mb = serializers.FloatField(read_only=True)
    is_shared = serializers.BooleanField(read_only=True)
    owner_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = File
        fields = ['id', 'original_name', 'stored_name', 'comment', 'size', 'size_mb', 'upload_date', 'last_download_date', 'share_link', 'is_shared', 'owner_username', 'is_deleted']
        read_only_fields = ['id', 'stored_name', 'size', 'upload_date', 'last_download_date', 'share_link', 'is_deleted']


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    comment = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_file(self, value):
        max_size = getattr(settings, 'MAX_UPLOAD_SIZE', 100 * 1024 * 1024)
        if value.size > max_size:
            raise serializers.ValidationError(f'Размер файла не должен превышать {max_size // (1024 * 1024)}MB')
        return value


class FileRenameSerializer(serializers.Serializer):
    new_name = serializers.CharField(max_length=255, required=True)

    def validate_new_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя файла не может быть пустым')

        forbidden_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
        if any(char in value for char in forbidden_chars):
            raise serializers.ValidationError('Имя содержит запрещенные символы')
        return value


class FileCommentSerializer(serializers.Serializer):
    comment = serializers.CharField(required=True, allow_blank=True)


class ShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['share_link']
        read_only_fields = ['share_link']