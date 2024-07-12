from django.urls import path, include
from rest_framework import routers

from ventas.api import SurtidorViewSet
from ventas.api.tipo_combustible_viewset import TipoCombustibleViewSet
from ventas.api.venta_viewset import VentaViewSet

router = routers.DefaultRouter()
router.register(r'surtidores', SurtidorViewSet)
router.register(r'ventas', VentaViewSet)
router.register(r'tipo-combustible', TipoCombustibleViewSet)

urlpatterns = [
    path('', include(router.urls))
]