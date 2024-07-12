from django.urls import path, include
from rest_framework import routers

from refineria.api import CamionViewSet
from refineria.api.ruta_viewset import RutaViewSet
from refineria.api.solicitud_viewset import SolicitudViewSet
from refineria.api.surtidor_ruta_viewset import SurtidorRutaViewSet
from refineria.api.tipo_combustible_viewset import TipoCombustibleViewSet

router = routers.DefaultRouter()
router.register(r'camiones', CamionViewSet)
router.register(r'rutas', RutaViewSet)
router.register(r'surtidores-ruta', SurtidorRutaViewSet)
router.register(r'tipo-combustible', TipoCombustibleViewSet)
router.register(r'solicitudes', SolicitudViewSet)

urlpatterns = [
    path('', include(router.urls))
]