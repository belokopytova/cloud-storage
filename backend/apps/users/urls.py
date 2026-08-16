

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    RegisterView, LoginView, LogoutView, CurrentUserView
)


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')


auth_urls = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='me'),
]

urlpatterns = [
    path('auth/', include(auth_urls)),
    path('', include(router.urls)),
]