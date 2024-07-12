from django.apps import AppConfig


class AccesosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accesos'

    def ready(self):
        from . import signals
