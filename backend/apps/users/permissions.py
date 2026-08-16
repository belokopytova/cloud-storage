from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Доступ только администратору или только чтение"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin

class IsAdminUser(permissions.BasePermission):
    """Только администратор"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """Владелец или администратор"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.user == request.user

class IsOwnerStorageOrAdmin(permissions.BasePermission):
    """Доступ к хранилищу владельца или администратора"""
    
    def has_permission(self, request, view):
        # Параметр user_id может быть в URL или в query params
        if request.user.is_admin:
            return True
        
        user_id = view.kwargs.get('user_id') or request.query_params.get('user_id')
        if user_id:
            return request.user.id == int(user_id)
        return True