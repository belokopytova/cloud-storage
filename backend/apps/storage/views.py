
import os
import uuid
from pathlib import Path

from django.conf import settings
from django.core.files.storage import default_storage
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsOwnerOrAdmin, IsOwnerStorageOrAdmin
from .models import File
from .serializers import FileCommentSerializer, FileRenameSerializer, FileSerializer, FileUploadSerializer


class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated, IsOwnerStorageOrAdmin]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if self.request.user.is_admin and user_id:
            return File.objects.filter(user_id=user_id, is_deleted=False).order_by('-upload_date')
        return File.objects.filter(user=self.request.user, is_deleted=False).order_by('-upload_date')


class FileUploadView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data['file']
        comment = serializer.validated_data.get('comment', '')

        storage_root = Path(settings.FILE_STORAGE_ROOT)
        user_folder = storage_root / request.user.storage_path.strip('/').replace('\\', '/')
        user_folder.mkdir(parents=True, exist_ok=True)

        ext = Path(uploaded_file.name).suffix
        stored_name = f'{uuid.uuid4().hex}{ext}'
        relative_dir = Path(request.user.storage_path.strip('/')).as_posix()
        full_path = user_folder / stored_name

        with default_storage.open(str(full_path.relative_to(storage_root)), 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        file_record = File.objects.create(
            user=request.user,
            original_name=uploaded_file.name,
            stored_name=stored_name,
            file_path=str(Path(relative_dir) / stored_name),
            comment=comment,
            size=uploaded_file.size,
        )
        return Response(FileSerializer(file_record).data, status=status.HTTP_201_CREATED)


class FileDetailView(generics.RetrieveDestroyAPIView):
    queryset = File.objects.filter(is_deleted=False)
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_admin and instance.user != request.user:
            return Response({'error': 'Нет доступа к файлу'}, status=status.HTTP_403_FORBIDDEN)

        file_path = Path(settings.FILE_STORAGE_ROOT) / instance.file_path
        if file_path.exists():
            file_path.unlink(missing_ok=True)

        instance.is_deleted = True
        instance.deleted_at = __import__('django.utils.timezone').utils.timezone.now()
        instance.save(update_fields=['is_deleted', 'deleted_at'])
        return Response({'message': 'Файл удалён'}, status=status.HTTP_200_OK)


class FileRenameView(views.APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def post(self, request, pk):
        file_obj = get_object_or_404(File, pk=pk, is_deleted=False)
        self.check_object_permissions(request, file_obj)

        serializer = FileRenameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_name = serializer.validated_data['new_name']
        file_obj.original_name = new_name
        file_obj.save(update_fields=['original_name'])
        return Response({'message': 'Имя файла обновлено', 'file': FileSerializer(file_obj).data})


class FileCommentView(views.APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def post(self, request, pk):
        file_obj = get_object_or_404(File, pk=pk, is_deleted=False)
        self.check_object_permissions(request, file_obj)

        serializer = FileCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_obj.comment = serializer.validated_data['comment']
        file_obj.save(update_fields=['comment'])
        return Response({'message': 'Комментарий обновлён', 'file': FileSerializer(file_obj).data})


class FileShareView(views.APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def post(self, request, pk):
        file_obj = get_object_or_404(File, pk=pk, is_deleted=False)
        self.check_object_permissions(request, file_obj)

        token = file_obj.generate_share_link()
        file_obj.share_link = token
        file_obj.save(update_fields=['share_link'])
        return Response({'share_link': token, 'download_url': f'/api/v1/share/{token}/'})


class FileDownloadView(views.APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request, pk):
        file_obj = get_object_or_404(File, pk=pk, is_deleted=False)
        self.check_object_permissions(request, file_obj)

        file_path = Path(settings.FILE_STORAGE_ROOT) / file_obj.file_path
        if not file_path.exists():
            raise Http404('Файл не найден на диске')

        file_obj.update_last_download()
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_obj.original_name)


class ShareLinkDownloadView(views.APIView):
    permission_classes = []

    def get(self, request, share_link):
        file_obj = get_object_or_404(File, share_link=share_link, is_deleted=False)
        file_path = Path(settings.FILE_STORAGE_ROOT) / file_obj.file_path
        if not file_path.exists():
            raise Http404('Файл не найден на диске')

        file_obj.update_last_download()
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_obj.original_name)


class FileDeleteView(views.APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def delete(self, request, pk):
        return FileDetailView.destroy(self, request, pk=pk)