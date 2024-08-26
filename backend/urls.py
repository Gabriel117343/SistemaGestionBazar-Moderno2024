from django.urls import path, include
from rest_framework import routers
from backend import views
from .views import *
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # permite obtener y renovar el token con el estandard JWT

router = routers.DefaultRouter() # tiene el crud de los usuarios"""
router.register(r'usuarios', views.UsuarioView, 'usuarios')
# proveedores
router.register(r'proveedores', views.ProveedorView, 'proveedores')
# Productos
router.register(r'productos', views.ProductoView, 'productos')
# Secciones
router.register(r'secciones', views.SeccionView, 'secciones')
# Stock
router.register(r'stocks', views.StockView, 'stocks')
# Pedido
router.register(r'pedidos', views.PedidoView, 'pedidos')
# ProductoPedido
router.register(r'productos_pedidos', views.ProductoPedidoView, 'productos_pedidos')
# Cliente
router.register(r'clientes', views.ClienteView, 'clientes')
# Ventas
router.register(r'ventas', views.VentaView, 'ventas')
# Categorias
router.register(r'categorias', views.CategoriaView, 'categorias')
urlpatterns = [
    path('datos/v1/', include(router.urls)),
    path('docs/', get_docs_view()), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.LoginView.as_view()), 
    path('logout/', views.LogoutView.as_view()),
    path('get_usuario_logeado/', views.GetUsuarioLogeado.as_view()),
    path('generate_password_reset_link/', GeneratePasswordResetLinkView.as_view()),
    path('send_password_reset_email/',  SendPasswordResetEmailView.as_view()),
    path('reset_password/', ResetPasswordView.as_view()),
]