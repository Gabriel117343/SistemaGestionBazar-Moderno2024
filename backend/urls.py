from django.urls import path, include
from rest_framework import routers
from backend import views
from .views import *
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # permite obtener y renovar el token con el estandard JWT

router = routers.DefaultRouter()

# TODAS ESTAS RUTAS SIGUEN EL ESTANDAR CRUD (Create, Read, Update, Delete) 
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

    # Rutas de documentación
    path('docs/', get_docs_view()), # utiliza include_docs_urls de rest_framework

    # Rutas de autenticación
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('get_usuario_logeado/', views.GetUsuarioLogeado.as_view()),
    path('generate_password_reset_link/', GeneratePasswordResetLinkView.as_view()),
    path('send_password_reset_email/',  SendPasswordResetEmailView.as_view()),
    path('reset_password/', ResetPasswordView.as_view()),

    # Rutas de reportes de ventas que sera consumido por el frontend para mostrar graficos de todo tipo
    path('ventas_categorias/', VentaCategoriaAPIView.as_view(), name='ventas_categorias'),
    path('ventas_productos/', VentaProductoAPIView.as_view(), name='ventas_productos'),
    path('ventas_proveedores/', VentaProveedorAPIView.as_view(), name='ventas_proveedores'),
    path('ventas_secciones/', VentaSeccionAPIView.as_view(), name='ventas_secciones'),
]