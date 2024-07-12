from rest_framework.permissions import BasePermission

class allowAny(BasePermission):
    def has_permission(self, request, view):
        return True

class IsVendedor(BasePermission):
    message = 'No tienes permisos para hacer esto'

    def has_permission(self, request, view):
        token = request.auth
        role_id = token['role']
        print(role_id)
        return role_id == 4


class IsAdministradorSurtidor(BasePermission):
    message = 'No tienes permisos para hacer esto'

    def has_permission(self, request, view):
        token = request.auth
        role_id = token['role']
        print(role_id)
        return role_id == 3
