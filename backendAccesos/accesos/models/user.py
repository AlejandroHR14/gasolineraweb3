# from django.contrib.auth.models import AbstractUser, Group, Permission
# from django.db import models
#
#
# class User(AbstractUser):
#     ROLES = [
#         (1, 'Administrador de Accesos'),
#         (2, 'Administrador de Surtidor'),
#         (3, 'Administrador de Refinería'),
#         (4, 'Vendedor'),
#         (5, 'Chofer'),
#     ]
#     role = models.IntegerField(max_length=20, choices=ROLES)
#     surtidor = models.ForeignKey(
#         'Surtidor',
#         on_delete=models.CASCADE,
#         related_name='users',
#         null=True,
#         blank=True,
#     )
#
#     groups = models.ManyToManyField(
#         Group,
#         related_name='custom_user_group',  # Nombre personalizado para evitar conflictos
#         blank=True,
#         help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
#         related_query_name='user',
#     )
#     user_permissions = models.ManyToManyField(
#         Permission,
#         related_name='custom_user_permission',  # Nombre personalizado para evitar conflictos
#         blank=True,
#         help_text='Specific permissions for this user.',
#         related_query_name='user',
#     )
