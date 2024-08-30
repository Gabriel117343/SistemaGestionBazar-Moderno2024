from cmath import e
from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.utils import timezone
from .serializer import *
from .models import *

from django.db import transaction
# Create your views here.
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from .serializer import UsuarioSerializer
#importamos el status para darle un estado a la respuesta
from rest_framework import status
from rest_framework.response import Response
import json
import os # para eliminar la imagen anterior cuando se actualiza la imagen de un usuario

from rest_framework.exceptions import NotFound
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.core.mail import send_mail # para enviar correos
from django.conf import settings # para enviar correos
from django.contrib.auth.forms import PasswordResetForm # para recuperar contraseña
from django.contrib.auth.views import PasswordResetView # para recuperar contraseña
from rest_framework.permissions import AllowAny # para permitir cualquier usuario
from django.utils.http import urlsafe_base64_encode # para recuperar contraseña 
from django.utils.encoding import force_bytes # para recuperar contraseña 
from django.contrib.auth.tokens import default_token_generator # para recuperar contraseña
from django.contrib.auth import get_user_model
from django.utils.encoding import smart_str # para recuperar contraseña
from django.utils.http import urlsafe_base64_decode # para recuperar contraseña
from rest_framework.decorators import api_view
from django.contrib.sites.shortcuts import get_current_site # para obtener el dominio actual http://localhost:8000
from datetime import datetime, time # para saber la fecha actual
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import F

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken # para obtener el token de autenticación JWT
# importando JWTAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
# lista negra de tokens para bloquear tokens de acceso y actualización que se han utilizado
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


from django.utils.deprecation import MiddlewareMixin
from rest_framework.documentation import include_docs_urls
import pytz # para obtener la zona horaria

User = get_user_model() # esto es para obtener el modelo de usuario que se está utilizando en el proyecto

# Middleware para rastrea la última actividad de los usuarios y actualiza la última actividad en cada solicitud de las vistas de la API
class ActualizarUltimaActividadMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            # Asegúrate de que request.user sea una instancia de tu modelo de usuario personalizado
            print("Actualizando ultima actividad")
            request.user.ultima_actividad = timezone.now()
            request.user.save()
        return response

# Middleware para fines de desarrollo, util para añadir el token JWT como un parámetro de consulta en lugar de en el encabezado de autorización ej http://localhost:8000/usuarios/datos/v1/productos/?jwt=token
class JWTQueryParameterMiddleware(MiddlewareMixin):

    # process_request intercepta cada solicitud entrante y agrega el token JWT del parámetro de consulta a los encabezados de autorización
    def process_request(self, request):
        token = request.GET.get('jwt')
        if token:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
# Paso 1: Crear una clase de vista personalizada para la documentación
class PublicDocsView:
    permission_classes = [AllowAny]
    authentication_classes = []

# Paso 2: Crear una función que devuelva la vista de documentación con las clases de permisos y autenticación sobrescritas
def get_docs_view():
    # Importante - usar Authentication > Token y agregar el token de la sesión para poder realizar las pruebas en la documentación
    # Uso Ej: http://localhost:8000/usuarios/docs/
    return include_docs_urls(
        title='API Documentation',
        permission_classes=PublicDocsView.permission_classes,
        authentication_classes=PublicDocsView.authentication_classes
    )
class ResetPasswordView(APIView):
    permission_classes = [AllowAny] # esto es para permitir cualquier usuario porque el usuario no está autenticado cuando se restablece la contraseña
    def post(self, request):
        uid_b64 = request.data.get('uid')
        if not uid_b64:
            return Response({'error': 'No se proporciono UID'}, status=400)

        uid = smart_str(urlsafe_base64_decode(uid_b64))
        token = request.data.get('token')
        password = request.data.get('password')

        user = Usuario.objects.filter(pk=uid).first()

        if user and default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'error': 'Contraseña restablecida con éxito'}, status=200)
        else:
            return Response({'error': 'Hubo un error al actualizar la contraseña' }, status=400)
        
class LoginView(APIView):
    print('ejecuando Login...')
    permission_classes = [AllowAny] # esto es para permitir cualquier usuario porque el usuario no está autenticado cuando se logea
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model()
        # 1 valida si el usurio esta activo con su correo antes de autenticar
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Credenciales Invalidas', '': 'credenciales'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({'error': 'Su cuenta se encuentra Inactiva, contacte con el Administrador', '': 'cuenta'}, status=status.HTTP_400_BAD_REQUEST)

        #---------------------------------
        # 1 valida si el usuario esta dentro del horario laboral
        now = datetime.now().time()  # obtén la hora actual
        if user.jornada == 'duirno' and not (time(9, 0) <= now <= time(18, 0)):
            return Response({'error': 'Esta cuenta esta fuera del Horario laboral, contacte con el Administrador', '': 'horario'}, status=status.HTTP_400_BAD_REQUEST)
        elif user.jornada == 'vespertino' and not (time(18, 0) <= now or now <= time(9, 0)):
            return Response({'error': 'Esta cuenta esta fuera del Horario laboral, contacte con el Administrador', '': 'horario'}, status=status.HTTP_400_BAD_REQUEST)
        #---------------------------------
        # 2 autentica al usuario  
        user = authenticate(request, email=email, password=password) # autentica al usuario


        if user is not None:
            auth_login(request, user)  # Logea al usuario en el sistema


            try:
                # Genera tokens de acceso y actualización para el usuario
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                user = request.user
                user.last_login = timezone.now()  # Actualiza la última vez que el usuario inició sesión
                # Guarda el token de refresco en el modelo de tokens pendientes
            
                user.save()
                current_site = get_current_site(request)  # Obteniendo el dominio actual
                domain = current_site.domain
                user_data = {
                    'nombre': user.nombre,
                    'rol': user.rol,
                    'apellido': user.apellido,
                    'jornada': user.jornada,
                    'is_active': user.is_active,
                    'imagen': f'http://{domain}{user.imagen.url}' if user.imagen else None,
                    'email': user.email,
                    'id': user.id
                }

                return Response({
                    'refresh': str(refresh),
                    'access': str(access_token),
                    'message': 'Se ha logeado Exitosamente',
                    'usuario': user_data
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': 'Cannot create token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response({'error': 'Credenciales Invalidas', '': 'credenciales'}, status=status.HTTP_400_BAD_REQUEST)
class GeneratePasswordResetLinkView(APIView):
    permission_classes = [JWTAuthentication]
    print('Generando passowrd reset link')
    def post(self, request):
        email = request.data.get('email')
        user = Usuario.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))  # remove .decode()
            print('uid_----____', uid)
            return Response({'uid': uid, 'token': token})  # return 'uid' and 'token' instead of 'reset_link
        else:
            return Response({'error': 'Usuario no encontrado'}, status=404) 

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                token = RefreshToken(refresh_token)
            except TokenError as e:
                raise AuthenticationFailed('Invalid refresh token')

             # Se añade el token a la lista de tokens pendientes de eliminación
            print('Token ---------------------', token)
            # remover el token de el oustading y agregarlo a la blacklist
            
            token.blacklist()

            # Actualizar el último inicio de sesión del usuario
            user = request.user
            user.last_login = timezone.now()  # Actualiza la última vez que el usuario inició sesión
            user.save()
            
            return Response({'message': 'Ha cerrado sesión correctamente'}, status=status.HTTP_200_OK)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Error al cerrar sesión: {str(e)}")
            return Response({'error': 'Ha ocurrido un error al cerrar sesión'}, status=status.HTTP_400_BAD_REQUEST)
class SendPasswordResetEmailView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            email = request.data.get('email')
            reset_link = request.data.get('reset_link')
            
            send_mail(
                'Restablecimiento de contraseña',
                f'Haga clic en el siguiente enlace para restablecer su contraseña: {reset_link}',
                'hotel.arica00@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response({'message': 'Correo electrónico de restablecimiento de contraseña enviado'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class GetUsuarioLogeado(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def get(self, request):
        user = request.user  # JWTAuthentication ya habrá autenticado al usuario
        if user.is_anonymous:
            return Response({'error': 'No autorizado. Por favor, inicie sesión.'},status=status.HTTP_401_UNAUTHORIZED)
        
        # Obtén el dominio actual
        current_site = get_current_site(request)
        domain = current_site.domain

        # Actualizar el último inicio de sesión del usuario
        user = request.user
        user.last_login = timezone.now()  # Actualiza la última vez que el usuario inició sesión
        user.save()
        
        # Prepara y envía la respuesta
        user_data = {
            'nombre': user.nombre,
            'rol': user.rol,
            'apellido': user.apellido,
            'jornada': user.jornada,
            'is_active': user.is_active,
            'imagen': f'http://{domain}{user.imagen.url}' if user.imagen else None,
            'email': user.email,
            'id': user.id
        }
        
        return Response({'usuario': user_data}, status=status.HTTP_200_OK)
class SendPasswordResetEmailView(APIView):
    permission_classes = [AllowAny]
    print('YYYYYYYYYY')
    def post(self, request):
        email = request.data.get('email')
        print(email)
        reset_link = request.data.get('reset_link')
        print(reset_link)
        send_mail(
            'Restablecimiento de contraseña',
            f'Haga clic en el siguiente enlace para restablecer su contraseña: {reset_link}',
            'hotel.arica00@gmail.com',
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Correo electrónico de restablecimiento de contraseña enviado'})
    

class UsuarioView(viewsets.ModelViewSet): # este método es para listar, crear, actualizar y eliminar usuarios desde la api en React
    serializer_class = UsuarioSerializer #Esto indica que UsuarioSerializer se utilizará para serializar y deserializar instancias del modelo Usuario.
    queryset = Usuario.objects.all() # Esto indica que todas las instancias del modelo Usuario son el conjunto de datos sobre el que operará esta vista.
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'data': serializer.data, 'message': 'Usuarios obtenidos!'}, status=status.HTTP_200_OK)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.imagen and hasattr(instance.imagen, 'path'):
            image_path = os.path.join(settings.MEDIA_ROOT, instance.imagen.path)  # Guarda la ruta de la imagen
            self.perform_destroy(instance) # Elimina el usuario
            # Si la imagen existe se borrar para que no quede en el servidor
            if os.path.isfile(image_path):
                os.remove(image_path)
        else:
            self.perform_destroy(instance) # Elimina el usuario si no tiene imagen
        return Response({'message': 'Usuario eliminado!'}, status=status.HTTP_200_OK)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()

            # Crear un Recepcionista, PersonalAseo o Administrador dependiendo del rol

            return Response({'data': serializer.data, 'message': 'Se ha credo el Usuario Exitosamente'}, status=status.HTTP_201_CREATED)
        return Response({'error': 'No se ha podido crear el Usuario'}, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request, *args, **kwargs):
        try: 

            queryset = Usuario.objects.all().order_by('-id')
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Usuarios obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los usuarios'}, status=status.HTTP_400_BAD_REQUEST)
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_image = instance.imagen  # Guarda la referencia a la imagen anterior

        serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
        if serializer.is_valid():
            self.perform_update(serializer) # Actualiza el usuario

            # Si la imagen ha cambiado y la imagen antigua existe, borra la imagen anterior
            if old_image != instance.imagen and old_image and hasattr(old_image, 'path'):
                os.remove(os.path.join(settings.MEDIA_ROOT, old_image.path))

            return Response({'data': serializer.data, 'message': 'Usuario actualizado correctamente!'}, status=status.HTTP_200_OK)
        return Response({'message': 'Error al actualizar el usuario', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    # Django Rest Framework proporciona los siguientes métodos para operaciones CRUD en ModelViewSet:

    # .list(): Para listar todos los objetos (GET)
    # .retrieve(): Para obtener un objeto específico (GET con id)
    # .create(): Para crear un nuevo objeto (POST)
    # .update(): Para actualizar un objeto existente (PUT)
    # .partial_update(): Para actualizar parcialmente un objeto existente (PATCH)
    # .destroy(): Para eliminar un objeto existente (DELETE)
    # Por lo tanto, puedes realizar operaciones CRUD en el modelo Usuario a través de esta vista.

class ProveedorView(viewsets.ModelViewSet):
    serializer_class = ProveedorSerializer
    queryset = Proveedor.objects.all() # Esto indica que todas las instancias del modelo Proveedor son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Proveedores obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los Proveedores'}, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance) # Elimina el Proveedor
            return Response({'message': 'Proveedor eliminado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al eliminar el Proveedor'}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                proveedor = serializer.save()
                return Response({'data': serializer.data, 'message': 'Se ha credo el Proveedor Exitosamente'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'No se ha podido crear el Proveedor'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear el Proveedor'}, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                self.perform_update(serializer) # Actualiza el Proveedor
                return Response({'data': serializer.data, 'message': 'Proveedor actualizado correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar el Proveedor', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar el Proveedor'}, status=status.HTTP_400_BAD_REQUEST)
    
class ProductoView(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all() # Esto indica que todas las instancias del modelo Producto son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def get_queryset(self):
        """
        Sobrescribe el método get_queryset para retornar productos basados en el estado de activación
        solo cuando se listan los productos. Para otras acciones, retorna todos los productos.
        """
        queryset = Producto.objects.select_related('proveedor', 'seccion', 'stock')
        
        # Aplica la lógica de incluir_inactivos solo para la acción 'list'
        if self.action == 'list':
            incluir_inactivos = self.request.query_params.get('incluir_inactivos', 'no').lower() == 'si'
            if not incluir_inactivos:
                queryset = queryset.filter(estado=True)
        # utilizar select_related para obtener los datos relacionados con el proveedor y la sección, evitando así consultas adicionales a la base de datos y el problema de N + 1 
        return queryset
   
    def list(self, request, *args, **kwargs):
        print("Obteniendo Productos")
        try: 
            queryset = self.get_queryset()
            
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Productos obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los Productos'}, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance) # Elimina el Producto
            return Response({'message': 'Producto eliminado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al eliminar el Producto'}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                proveedor_id = request.data.get('proveedor')
                seccion_id = request.data.get('seccion')
                categoria_id = request.data.get('categoria')
                print('CATETORIA', categoria_id)
                try:
                    proveedor = Proveedor.objects.get(id=proveedor_id)
                    seccion = Seccion.objects.get(id=seccion_id)
                    categoria = Categoria.objects.get(id=categoria_id)
                except Proveedor.DoesNotExist:
                    return Response({'error': 'Proveedor no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
                except Seccion.DoesNotExist:
                    return Response({'error': 'Sección no encontrada'}, status=status.HTTP_400_BAD_REQUEST)
                except Categoria.DoesNotExist:
                    return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_400_BAD_REQUEST)

                producto = serializer.save(proveedor=proveedor, seccion=seccion, categoria=categoria)
                Stock.objects.create(producto=producto, cantidad=0)
                return Response({'data': serializer.data, 'message': 'Producto creado exitosamente'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'Datos inválidos', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear el Producto', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)  # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                categoria_id = request.data.get('categoria')
                seccion_id = request.data.get('seccion')
                
                # transaction.atomic() para asegurar que todas las operaciones de base de datos se realicen correctamente o se reviertan si hay un error en alguna de ellas
                with transaction.atomic():
                    if categoria_id:
                        try:
                            categoria = Categoria.objects.get(id=categoria_id)
                            instance.categoria = categoria
                        except Categoria.DoesNotExist:
                            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    if seccion_id:
                        try:
                            seccion = Seccion.objects.get(id=seccion_id)
                            instance.seccion = seccion
                        except Seccion.DoesNotExist:
                            return Response({'error': 'Sección no encontrada'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    self.perform_update(serializer)  # Actualiza el Producto

                return Response({'data': serializer.data, 'message': 'Producto actualizado correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar el Producto', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar el Producto', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class CategoriaView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all() # Esto indica que todas las instancias del modelo Categoria son el conjunto de datos sobre el que operará esta vista.
    def get(self, request, *args, **kwargs):
        try:
            queryset = Categoria.objects.all()
            serializer = CategoriaSerializer(queryset, many=True)
            if not serializer.data:
                return Response({'error': 'No hay Categorías registradas'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'data': serializer.data, 'message': 'Categorías obtenidas!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener las Categorías'}, status=status.HTTP_400_BAD_REQUEST)

class SeccionView(viewsets.ModelViewSet):
    serializer_class = SeccionSerializer
    queryset = Seccion.objects.all() # Esto indica que todas las instancias del modelo Seccion son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Secciones obtenidas!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener las Secciones'}, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()  # Intenta obtener la instancia basada en el ID de la URL
            self.perform_destroy(instance)  # Llama a la función para eliminar la instancia
            return Response({'message': 'Seccion eliminada!'}, status=status.HTTP_200_OK)
        except NotFound:
            return Response({'error': 'Seccion no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Error al eliminar la Seccion'}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                seccion = serializer.save()
                return Response({'data': serializer.data, 'message': 'Se ha credo la Seccion Exitosamente'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'No se ha podido crear la Seccion'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear la Seccion'}, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                self.perform_update(serializer) # Actualiza la Seccion
                return Response({'data': serializer.data, 'message': 'Seccion actualizada correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar la Seccion', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar la Seccion'}, status=status.HTTP_400_BAD_REQUEST)
class StockView(viewsets.ModelViewSet):
    serializer_class = StockSerializer
    queryset = Stock.objects.all() # Esto indica que todas las instancias del modelo Stock son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication

    @action(detail=True, methods=['post'])
    def recibir(self, request, pk=None):
        try:
            # Busca el producto en el stock
            stock_item = self.get_object()

            # Aumenta el stock
            stock_item.cantidad = F('cantidad') + request.data.get('cantidad', 0) # F es para obtener el valor actual de la cantidad
            stock_item.save() # guarda la cantidad actualizada

            return Response({'message': 'Stock actualizado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al actualizar el stock'}, status=status.HTTP_400_BAD_REQUEST)
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Stock obtenido!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener el Stock'}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                self.perform_update(serializer) # Actualiza el Stock
                return Response({'data': serializer.data, 'message': 'Stock actualizado correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar el Stock', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar el Stock'}, status=status.HTTP_400_BAD_REQUEST)
        

class PedidoView(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all() # Esto indica que todas las instancias del modelo Pedido son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Pedidos obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los Pedidos'}, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance) # Elimina el Pedido
            return Response({'message': 'Pedido eliminado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al eliminar el Pedido'}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Obtén el ID del proveedor del request
                proveedor_id = request.data.get('proveedor')
                print('proveedor:', proveedor_id)
                # Busca el proveedor en la base de datos
                proveedor = Proveedor.objects.get(id=proveedor_id)

                # Obtén el ID del usuario logeado
                usuario_id = request.user.id
                # Busca el usuario en la base de datos
                usuario = Usuario.objects.get(id=usuario_id)

                # Asocia el pedido con el proveedor y el usuario antes de guardarlo
                pedido = serializer.save(proveedor=proveedor, usuario=usuario)

                return Response({'message': 'Pedido creado!', 'pedidoId': pedido.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear el Pedido'}, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                self.perform_update(serializer) # Actualiza el Pedido
                return Response({'data': serializer.data, 'message': 'Pedido actualizado correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar el Pedido', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar el Pedido'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['put']) # put porque se actualiza el estado del pedido
    def recibir(self, request, pk=None): # pk es el id del pedido
        try:
            # Busca el pedido
            pedido = self.get_object()

            # Marca el pedido como recibido
            pedido.estado = 'recibido'
            pedido.save()

            # Itera sobre los productos del pedido
            for producto_pedido in pedido.productos.all():
                # Busca el producto en el stock
                stock_item = Stock.objects.get(producto=producto_pedido.producto)

                # Aumenta el stock de cada uno de los productos pedidos dentro de la orden de compra
                stock_item.cantidad = F('cantidad') + producto_pedido.cantidad
                stock_item.save()

            return Response({'message': 'Pedido recibido y stock actualizado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al recibir el pedido'}, status=status.HTTP_400_BAD_REQUEST)
class ProductoPedidoView(viewsets.ModelViewSet):
    serializer_class = ProductoPedidoSerializer
    queryset = ProductoPedido.objects.all() # Esto indica que todas las instancias del modelo ProductoPedido son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def create(self, request, *args, **kwargs):
        try:
            pedido_id = request.data.get('pedido')
            pedido = Pedido.objects.get(id=pedido_id)
            producto_pedido_data = request.data

            serializer = self.get_serializer(data=producto_pedido_data)
            if serializer.is_valid():
                productoPedido = serializer.save(pedido=pedido)
                return Response({'message': 'ProductoPedido creado exitosamente'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'No se ha podido crear el ProductoPedido', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear el ProductoPedido'}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'ProductosPedidos obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los ProductosPedidos'}, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance) # Elimina el ProductoPedido
            return Response({'message': 'ProductoPedido eliminado!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al eliminar el ProductoPedido'}, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True) # partial=True para permitir actualizaciones parciales
            if serializer.is_valid():
                self.perform_update(serializer) # Actualiza el ProductoPedido
                return Response({'data': serializer.data, 'message': 'ProductoPedido actualizado correctamente!'}, status=status.HTTP_200_OK)
            return Response({'message': 'Error al actualizar el ProductoPedido', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al actualizar el ProductoPedido'}, status=status.HTTP_400_BAD_REQUEST)
        

class ClienteView(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all() # Esto indica que todas las instancias del modelo Cliente son el conjunto de datos sobre el que operará esta vista.
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Cambiado a JWTAuthentication
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({'data': serializer.data, 'message': 'Clientes obtenidos!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al obtener los Clientes'}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                cliente = serializer.save()
                return Response({'data': serializer.data, 'message': 'Se ha credo el Cliente Exitosamente'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'No se ha podido crear el Cliente'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error al crear el Cliente'}, status=status.HTTP_400_BAD_REQUEST)
class VentaView(viewsets.ModelViewSet):
    serializer_class = VentaSerializer
    queryset = Venta.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            cliente_id = request.data.get('cliente')
            total = request.data.get('total')

            info_venta_json = request.data.get('info_venta_json')
            
            try:
                # Se utiliza atomic para asegurar que todas las operaciones se realizen o se reviertan en caso de error en alguna de ellas 
                with transaction.atomic():
                    cliente = Cliente.objects.get(id=cliente_id)
                    vendedor = Usuario.objects.get(id=request.user.id)
                    # Guardar solo los campos necesarios
                    venta = serializer.save(cliente=cliente, vendedor=vendedor, total=total)

                    try:
                        info_venta = json.loads(info_venta_json)
                    except json.JSONDecodeError:
                        return Response({'message': 'Formato JSON inválido en info_venta_json'}, status=status.HTTP_400_BAD_REQUEST)

                    if not isinstance(info_venta, list):
                        return Response({'message': 'info_venta_json debe ser una lista de objetos'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # 1 - Se obtienen los productos vendidos
                    productos_vendidos = self.obtener_productos_vendidos(info_venta)
                    # 2 - A partir de los productos vendidos, se actualiza el stock de cada uno de ellos
                    self.actualizar_stock(productos_vendidos)
                    # 3 - Se guardan los detalles de la venta
                    try:
                        venta.save()
                    except Exception as e:
                        return Response({'message': f'Error al guardar la venta: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # 4 - una vez que se ha realizado la venta, se actualiza la información de la venta
                    self.TransformarDatosVenta(info_venta, venta) 

                    return Response({'message': 'Venta realizada exitosamente!'}, status=status.HTTP_201_CREATED)
            except Cliente.DoesNotExist:
                return Response({'message': 'Cliente no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
            except Usuario.DoesNotExist:
                return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
            except Stock.DoesNotExist:
                return Response({'message': 'Stock no encontrado para uno de los productos'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                # captura cualquier error raise Exception
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def obtener_productos_vendidos(self, info_venta):
        productos_vendidos = []
        for item in info_venta:
            if 'producto' in item:
                productos_vendidos.extend(item['producto'])

        if not productos_vendidos:
            raise Exception('No se han encontrado productos en la información de la venta')
        return productos_vendidos

    def actualizar_stock(self, productos_vendidos):
        for producto in productos_vendidos:
            producto_id = producto['entidad_id']
            cantidad_vendida = producto['cantidad']
            stock = Stock.objects.get(producto_id=producto_id)
            if stock.cantidad >= cantidad_vendida:
                stock.cantidad -= cantidad_vendida
                stock.save()
            else:
                raise Stock.DoesNotExist(f'No hay suficiente stock para el producto {producto_id}')

    def TransformarDatosVenta(self, info_venta, venta):
        transformar_datos_view = TransformarDatosView() # se encarga de actualizar el dashboard
        transformar_datos_response = transformar_datos_view.post(info_venta, venta) # se le envía la información de la venta para actualizar el dashboard
        if transformar_datos_response.status_code != status.HTTP_200_OK:
            raise Exception('Error al actualizar el dashboard')

class TransformarDatosView(APIView):
      # el parametros recibida venta corresponde a la venta que se acaba de realizar y se utilizara para crear las relaciones con las instancias de VentaCategoria, VentaProducto y VentaProveedor 


    def post(self, info_venta, venta, format=None):
        info_categoria = {}
        info_producto = {}
        info_proveedor = {}
        info_seccion = {}

        for item in info_venta:
            if 'categoria' in item:
                for categoria in item['categoria']:
                    categoria_id = categoria.get('entidad_id')
                    producto_id = categoria.get('producto_id')
                    proveedor_id = categoria.get('proveedor_id')
                    seccion_id = categoria.get('seccion_id')
                    if categoria_id is None:
                        continue  # O manejar el error de otra manera
                    cantidad = categoria['cantidad']
                    total = categoria['total']
                    categoria_nombre = Categoria.objects.get(id=categoria_id).nombre

                    if categoria_id not in info_categoria:
                        info_categoria[categoria_id] = {
                            'venta': venta,
                            'entidad_id': Categoria.objects.get(id=categoria_id) if categoria_id else None,
                            'nombre': categoria_nombre,
                            'cantidad': 0,
                            'total': 0.0,
                            'producto': Producto.objects.get(id=producto_id) if producto_id else None,
                            'proveedor': Proveedor.objects.get(id=proveedor_id) if proveedor_id else None,
                            'seccion': Seccion.objects.get(id=seccion_id) if seccion_id else None
                        }
                    # Actualiza la cantidad y el total de ventas
                    info_categoria[categoria_id]['cantidad'] += cantidad
                    info_categoria[categoria_id]['total'] += total

            if 'producto' in item:
                for producto in item['producto']:
                    producto_id = producto.get('entidad_id')
                    categoria_id = producto.get('categoria_id')
                    proveedor_id = producto.get('proveedor_id')
                    seccion_id = producto.get('seccion_id')
                    if producto_id is None:
                        continue  # O manejar el error de otra manera
                    cantidad = producto['cantidad']
                    total = producto['total']
                    producto_nombre = Producto.objects.get(id=producto_id).nombre

                    if producto_id not in info_producto:
                        info_producto[producto_id] = {
                            'venta': venta,
                            'entidad_id': Producto.objects.get(id=producto_id) if producto_id else None,
                            'nombre': producto_nombre,
                            'cantidad': 0,
                            'total': 0.0,
                            'categoria': Categoria.objects.get(id=categoria_id) if categoria_id else None,
                            'proveedor': Proveedor.objects.get(id=proveedor_id) if proveedor_id else None,
                            'seccion': Seccion.objects.get(id=seccion_id) if seccion_id else None
                        }
                    # Actualiza la cantidad y el total de ventas
                    info_producto[producto_id]['cantidad'] += cantidad
                    info_producto[producto_id]['total'] += total

            if 'proveedor' in item:
                for proveedor in item['proveedor']:
                    proveedor_id = proveedor.get('entidad_id')
                    categoria_id = proveedor.get('categoria_id')
                    producto_id = proveedor.get('producto_id')
                    seccion_id = proveedor.get('seccion_id')
                    if proveedor_id is None:
                        continue  # O manejar el error de otra manera
                    cantidad = proveedor['cantidad']
                    total = proveedor['total']
                    proveedor_nombre = Proveedor.objects.get(id=proveedor_id).nombre

                    if proveedor_id not in info_proveedor:
                        info_proveedor[proveedor_id] = {
                            'venta': venta,
                            'entidad_id': Proveedor.objects.get(id=proveedor_id) if proveedor_id else None,
                            'nombre': proveedor_nombre,
                            'cantidad': 0,
                            'total': 0.0,
                            'categoria': Categoria.objects.get(id=categoria_id) if categoria_id else None,
                            'producto': Producto.objects.get(id=producto_id) if producto_id else None,
                            'seccion': Seccion.objects.get(id=seccion_id) if seccion_id else None
                        }
                    # Actualiza la cantidad y el total de ventas
                    info_proveedor[proveedor_id]['cantidad'] += cantidad
                    info_proveedor[proveedor_id]['total'] += total
        if 'seccion' in item:
            for seccion in item['seccion']:
                seccion_id = seccion.get('entidad_id')
                categoria_id = seccion.get('categoria_id')
                producto_id = seccion.get('producto_id')
                proveedor_id = seccion.get('proveedor_id')
                if seccion_id is None:
                    continue
                cantidad = seccion['cantidad']
                total = seccion['total']
                seccion_nombre = Seccion.objects.get(id=seccion_id).nombre

                if seccion_id not in info_seccion:
                    info_seccion[seccion_id] = {
                        'venta': venta,
                        'entidad_id': Seccion.objects.get(id=seccion_id) if seccion_id else None,
                        'nombre': seccion_nombre,
                        'cantidad': 0,
                        'total': 0.0,
                        'categoria': Categoria.objects.get(id=categoria_id) if categoria_id else None,
                        'producto': Producto.objects.get(id=producto_id) if producto_id else None,
                        'proveedor': Proveedor.objects.get(id=proveedor_id) if proveedor_id else None
                    }
                # Actualiza la cantidad y el total de ventas
                info_seccion[seccion_id]['cantidad'] += cantidad
                info_seccion[seccion_id]['total'] += total

        # Guarda las instancias
        try :
            for data in info_categoria.values():
                VentaCategoria.objects.create(**data)

            for data in info_producto.values():
                VentaProducto.objects.create(**data)

            for data in info_proveedor.values():
                VentaProveedor.objects.create(**data)

            for data in info_seccion.values():
                VentaSeccion.objects.create(**data)

            return Response('message: Se han registrados los datos de la venta exitosamente!', status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al guardar la información de la venta'}, status=status.HTTP_400_BAD_REQUEST)
        

# VISTAS PARA EL DASHBOARD DE VENTAS DEL FRONTEND

# Estas vistas permiten filtrar las ventas por categoría, producto, proveedor y sección, además de filtrar por rango de fechas.

# Ej: http://127.0.0.1:8000/usuarios/ventas_categoria/?fecha_inicio=2024-08-26&fecha_fin=2024-08-28

class VentaCategoriaAPIView(APIView):
    def get(self, request, *args, **kwargs):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        categoria_id = request.query_params.get('categoria_id')
        proveedor_id = request.query_params.get('proveedor_id')
        producto_id = request.query_params.get('producto_id')
        seccion_id = request.query_params.get('seccion_id')
        queryset = VentaCategoria.objects.all()
        
        if fecha_inicio and fecha_fin:
            # Convertir las fechas a objetos datetime con zona horaria
            tz = pytz.timezone('America/Santiago')  # O la zona horaria que estés usando
            fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio, '%Y-%m-%d'), tz)
            fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin, '%Y-%m-%d'), tz)
            queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])
        
        if categoria_id:
            queryset = queryset.filter(entidad_id=categoria_id)
        if proveedor_id:
            queryset = queryset.filter(proveedor_id=proveedor_id)
        if producto_id:
            queryset = queryset.filter(producto_id=producto_id)
        if seccion_id:
            queryset = queryset.filter(seccion_id=seccion_id)
        
        serializer = VentaCategoriaSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class VentaProductoAPIView(APIView):
    def get(self, request, *args, **kwargs):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        producto_id = request.query_params.get('producto_id')
        categoria_id = request.query_params.get('categoria_id')
        proveedor_id = request.query_params.get('proveedor_id')
        seccion_id = request.query_params.get('seccion_id')
        queryset = VentaProducto.objects.all()
        
        if fecha_inicio and fecha_fin:
            # Convertir las fechas a objetos datetime con zona horaria
            tz = pytz.timezone('America/Santiago')  # O la zona horaria que estés usando
            fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio, '%Y-%m-%d'), tz)
            fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin, '%Y-%m-%d'), tz)
            queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])
        
        if producto_id:
            queryset = queryset.filter(entidad_id=producto_id)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if proveedor_id:
            queryset = queryset.filter(proveedor_id=proveedor_id)
        if seccion_id:
            queryset = queryset.filter(seccion_id=seccion_id)
        
        serializer = VentaProductoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VentaProveedorAPIView(APIView):
    def get(self, request, *args, **kwargs):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        proveedor_id = request.query_params.get('proveedor_id')
        categoria_id = request.query_params.get('categoria_id')
        producto_id = request.query_params.get('producto_id')
        seccion_id = request.query_params.get('seccion_id')
        queryset = VentaProveedor.objects.all()
        
        if fecha_inicio and fecha_fin:
            # Convertir las fechas a objetos datetime con zona horaria
            tz = pytz.timezone('America/Santiago')  # O la zona horaria que estés usando
            fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio, '%Y-%m-%d'), tz)
            fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin, '%Y-%m-%d'), tz)
            queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])
        
        if proveedor_id:
            queryset = queryset.filter(entidad_id=proveedor_id)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if producto_id:
            queryset = queryset.filter(producto_id=producto_id)
        if seccion_id:
            queryset = queryset.filter(seccion_id=seccion_id)
        
        serializer = VentaProveedorSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class VentaSeccionAPIView(APIView):
    def get(self, request, *args, **kwargs):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        seccion_id = request.query_params.get('seccion_id')
        categoria_id = request.query_params.get('categoria_id')
        producto_id = request.query_params.get('producto_id')
        proveedor_id = request.query_params.get('proveedor_id')
        queryset = VentaSeccion.objects.all()
        
        if fecha_inicio and fecha_fin:
            # Convertir las fechas a objetos datetime con zona horaria
            tz = pytz.timezone('America/Santiago')
            fecha_inicio = timezone.make_aware(datetime.strptime(fecha_inicio, '%Y-%m-%d'), tz)
            fecha_fin = timezone.make_aware(datetime.strptime(fecha_fin, '%Y-%m-%d'), tz)
            queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])
        if seccion_id:
            queryset = queryset.filter(entidad_id=seccion_id)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if producto_id:
            queryset = queryset.filter(producto_id=producto_id)
        if proveedor_id:
            queryset = queryset.filter(proveedor_id=proveedor_id)
        
        serializer = VentaSeccionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)