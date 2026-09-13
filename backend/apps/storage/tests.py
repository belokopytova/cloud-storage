import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient

from apps.storage.models import File

User = get_user_model()

UPLOAD_URL = '/api/v1/files/upload/'


@pytest.fixture
def uploader(db):
    return User.objects.create_user(
        username='uploader',
        email='uploader@example.com',   
        password='pass12345',
    )


@pytest.fixture
def auth_client(uploader):
    client = APIClient()
    client.force_authenticate(user=uploader)
    return client


@pytest.mark.django_db
def test_upload_success(auth_client, uploader):
    """Авторизованный пользователь может загрузить файл."""
    uploaded = SimpleUploadedFile('test.txt', b'hello world', content_type='text/plain')

    response = auth_client.post(UPLOAD_URL, {'file': uploaded, 'comment': 'тестовый файл'})

    assert response.status_code == status.HTTP_201_CREATED
    assert File.objects.filter(user=uploader).count() == 1
    assert File.objects.first().original_name == 'test.txt'


@pytest.mark.django_db
def test_upload_without_file_fails(auth_client):
    """Без файла в запросе — ошибка валидации."""
    response = auth_client.post(UPLOAD_URL, {'comment': 'нет файла'})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_upload_requires_authentication():
    """Неавторизованный пользователь не может загрузить файл."""
    client = APIClient()
    uploaded = SimpleUploadedFile('test.txt', b'hello world', content_type='text/plain')

    response = client.post(UPLOAD_URL, {'file': uploaded})

    assert response.status_code == status.HTTP_403_FORBIDDEN