from rest_framework.permissions import BasePermission

class allowAny(BasePermission):
    def has_permission(self, request, view):
        return True

class IsChofer(BasePermission):
    message = 'No tienes permisos para hacer esto'

    def has_permission(self, request, view):
        token = request.auth
        role_id = token['role']
        print(role_id)
        return role_id == 5


class IsAdministradorRefineria(BasePermission):
    message = 'No tienes permisos para hacer esto'

    def has_permission(self, request, view):
        token = request.auth
        role_id = token['role']
        print(role_id)
        return role_id == 2
