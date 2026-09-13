import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()

REGISTER_URL = '/api/v1/auth/register/'
LOGIN_URL = '/api/v1/auth/login/'


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def existing_user(db):
    return User.objects.create_user(
        username='testuser',
        full_name='New User',
        email='testuser@example.com',
        password='pass12345'   
    )


# ============= RegisterView =============

@pytest.mark.django_db
def test_register_success(api_client):
    """Успешная регистрация создаёт пользователя и логинит его."""
    data = {
        'username': 'newuser',
        'full_name': 'New User',
        'email': 'newuser@example.com',
        'password': 'StrongPass123',
    }
    response = api_client.post(REGISTER_URL, data)

    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username='newuser').exists()


@pytest.mark.django_db
def test_register_duplicate_username_fails(api_client, existing_user):
    """Нельзя зарегистрировать пользователя с уже занятым username."""
    data = {
        'username': 'testuser',
        'full_name': 'New User',
        'email': 'other@example.com',
        'password': 'StrongPass123',
    }
    response = api_client.post(REGISTER_URL, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# ============= LoginView =============

@pytest.mark.django_db
def test_login_success(api_client, existing_user):
    """Верные логин/пароль — успешный вход."""
    response = api_client.post(LOGIN_URL, {
        'username': 'testuser',
        'password': 'pass12345',
    })

    assert response.status_code == status.HTTP_200_OK
    assert 'user' in response.data


@pytest.mark.django_db
def test_login_wrong_password_fails(api_client, existing_user):
    """Неверный пароль — вход отклонён."""
    response = api_client.post(LOGIN_URL, {
        'username': 'testuser',
        'password': 'wrongpassword',
    })

    assert response.status_code == status.HTTP_400_BAD_REQUEST