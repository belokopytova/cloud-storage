import re

from django.core.exceptions import ValidationError


def validate_username(value):
    if not value or not value.strip():
        raise ValidationError('Логин обязателен')
    if len(value) < 3 or len(value) > 30:
        raise ValidationError('Логин должен содержать от 3 до 30 символов')
    if not re.fullmatch(r'[A-Za-z0-9_\-]+', value):
        raise ValidationError('Логин может содержать только буквы, цифры, подчёркивание и дефис')
    return value


def validate_password_strength(value):
    if len(value) < 8:
        raise ValidationError('Пароль должен содержать не менее 8 символов')
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Пароль должен содержать хотя бы одну заглавную букву')
    if not re.search(r'[a-z]', value):
        raise ValidationError('Пароль должен содержать хотя бы одну строчную букву')
    if not re.search(r'\d', value):
        raise ValidationError('Пароль должен содержать хотя бы одну цифру')
    return value
