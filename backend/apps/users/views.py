from django.contrib.auth import login, logout  
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import User
from .serializers import (
    UserLoginSerializer, 
    UserRegistrationSerializer, 
    UserSerializer, 
    UserUpdateSerializer
)

@extend_schema(
    summary="Регистрация нового пользователя",
    description="Создает пользователя и автоматически выполняет вход"
)
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
  
        login(request, user)
        
        return Response(
            {
                'message': 'Пользователь успешно зарегистрирован',
                'user': UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )

@extend_schema(
    summary="Вход в систему",
    description="Аутентификация по username и password",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {
                    'type': 'string',
                    'description': 'Имя пользователя',
                    'example': 'admin'
                },
                'password': {
                    'type': 'string',
                    'description': 'Пароль',
                    'example': 'admin123',
                    'writeOnly': True
                }
            },
            'required': ['username', 'password']
        }
    },
    responses={
        200: OpenApiResponse(
            response={
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string'},
                            'full_name': {'type': 'string'},
                            'is_admin': {'type': 'boolean'},
                            'storage_path': {'type': 'string'},
                            'created_at': {'type': 'string'}
                        }
                    }
                }
            },
            description='Успешный вход'
        ),
        400: OpenApiResponse(description='Неверные данные')
    }
)
class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        login(request, user)
        
        return Response({
            'message': 'Успешный вход',
            'user': UserSerializer(user).data
        })

@extend_schema(
    summary="Выход из системы",
    description="Завершает текущую сессию пользователя"
)
class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)  
        return Response({'message': 'Выход выполнен'})

@extend_schema(
    summary="Текущий пользователь",
    description="Возвращает данные аутентифицированного пользователя"
)
class CurrentUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

@extend_schema(
    tags=["Администрирование"],
    summary="Операции с пользователями",
    description="Набор операций для управления пользователями (только для администраторов)"
)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_admin:
            return User.objects.filter(id=user.id)
        return User.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_admin:
            return Response(
                {'error': 'Доступ запрещен'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        if instance == request.user:
            return Response(
                {'error': 'Нельзя удалить самого себя'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if instance.is_admin:
            return Response(
                {'error': 'Нельзя удалить администратора'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(
            {'message': f'Пользователь {instance.username} удален'}, 
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Администрирование"],
    summary="Список пользователей",
    description="Администратор видит всех, обычный пользователь - только себя"
)
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_admin:
            return User.objects.filter(id=self.request.user.id)
        return User.objects.all().order_by('-created_at')

@extend_schema(
    tags=["Администрирование"],
    summary="Управление пользователем",
    description="Получение, обновление или удаление пользователя (только для администраторов)"
)
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer

    def check_object_permissions(self, request, obj):
        if not request.user.is_admin:
            self.permission_denied(request, 'Доступ запрещен')
        if obj == request.user:
            self.permission_denied(request, 'Нельзя управлять собой')
        if obj.is_admin and obj != request.user:
            self.permission_denied(request, 'Нельзя управлять администраторами')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_admin:
            return Response(
                {'error': 'Доступ запрещен'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        if instance == request.user:
            return Response(
                {'error': 'Нельзя удалить себя'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if instance.is_admin:
            return Response(
                {'error': 'Нельзя удалить администратора'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(
            {'message': f'Пользователь {instance.username} удален'}, 
            status=status.HTTP_200_OK
        )

@extend_schema(
    tags=["Администрирование"],
    summary="Изменение статуса администратора",
    description="Назначает или снимает права администратора (только для администраторов)"
)
class UpdateAdminStatusView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if not request.user.is_admin:
            return Response(
                {'error': 'Доступ запрещен'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        target = get_object_or_404(User, id=pk)
        if target == request.user:
            return Response(
                {'error': 'Нельзя изменить свой статус'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if target.is_admin and request.user != target:
            return Response(
                {'error': 'Нельзя менять статус администратора'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        is_admin = request.data.get('is_admin')
        if is_admin is None:
            return Response(
                {'error': 'Поле is_admin обязательно'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        target.is_admin = bool(is_admin)
        target.save(update_fields=['is_admin'])
        return Response({
            'message': 'Статус администратора обновлен',
            'user': UserSerializer(target).data
        })