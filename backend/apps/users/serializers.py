from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User
from core.validators import validate_password_strength, validate_username


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password_strength]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'password']
        extra_kwargs = {
            'username': {'required': True, 'validators': [validate_username]},
            'email': {'required': True},
            'full_name': {'required': True, 'allow_blank': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Пользователь с таким логином уже существует')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(username=username, password=password)

        if not user or not user.is_active:
            raise serializers.ValidationError('Неверное имя пользователя или пароль')

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_admin', 'storage_path', 'created_at']
        read_only_fields = ['id', 'storage_path', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'is_admin']

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует')
        return value