from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from accesos.api import UserViewSet, SurtidorViewSet
# from accesos.api.login_viewset import LoginViewSet
from accesos.auth import CustomTokenObtainPairView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'surtidores', SurtidorViewSet)
# router.register(r'login', LoginViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]