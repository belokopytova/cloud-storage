from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email=None, password=None, full_name='', is_admin=False, **extra_fields):
        if not username:
            raise ValueError('Имя пользователя обязательно')
        if not email:
            raise ValueError('Email обязателен')

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            full_name=full_name,
            is_admin=is_admin,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, full_name='', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email=email, password=password, full_name=full_name, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True, db_index=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False, help_text='Администратор системы')
    storage_path = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def save(self, *args, **kwargs):
        if not self.storage_path:
            safe_name = self.username.strip().lower().replace(' ', '_')
            self.storage_path = safe_name
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.username} ({self.full_name or "User"})'

    def can_delete_user(self, target_user):
        return self.is_admin and self != target_user and not target_user.is_admin

    def can_manage_user(self, target_user):
        return self.is_admin and self != target_user and not target_user.is_admin

    def can_change_admin_status(self, target_user):
        return self.is_admin and self != target_user and not target_user.is_admin

    @property
    def can_access_admin_panel(self):
        return self.is_admin or self.is_staff
