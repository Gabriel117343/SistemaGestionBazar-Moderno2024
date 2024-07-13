"""
Django settings for formulario project.

Generated by 'django-admin startproject' using Django 4.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-osl4skyhoi3(k!+po&mupg(j0*$8qo+ch!0_y56v5*hg+dfl&q'



# Application definition

# --- CÓMO IMPLEMENTAR JWT EN ESTE PROYECTO > https://www.youtube.com/watch?v=zzBO8qRq_K4&t=14s ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',  # Asegúrate de que esto está incluido, esto es para poder hacer la autenticacion con tokens en la api
    'coreapi',
    'backend',
    'rest_framework_simplejwt.token_blacklist', # para poder hacer la lista negra de tokens
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'backend.views.JWTQueryParameterMiddleware', # esto es para que se pueda enviar el token jwt por la url
    'backend.views.ActualizarUltimaActividadMiddleware', # esto es para actualizar la ultima actividad del usuario
    'backend.middleware.TokenCleanupMiddleware', # esto es para limpiar la lista negra de tokens
]

ROOT_URLCONF = 'formulario.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'formulario.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
# zona horaria santiago chile
LANGUAGE_CODE = 'es-cl' # esto significa que el idioma es español y el pais es chile y hara que la fecha se muestre en español

TIME_ZONE = 'America/Santiago'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'formulario/static'),)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
CORS_ALLOW_CREDENTIALS = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
#cors autorizacion! ; se debe cambiar en produccion ; Origenes permitidos
CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5500', 'https://dwq9c4nw-5173.brs.devtunnels.ms', 'https://sistema-bazar-arica-moderno.netlify.app', 'https://deploy-preview-2--sistema-bazar-arica-moderno.netlify.app']
CORS_ORIGIN_WHITELIST = [
    "http://localhost:5173","https://dwq9c4nw-5173.brs.devtunnels.ms", 'https://sistema-bazar-arica-moderno.netlify.app', 'https://deploy-preview-2--sistema-bazar-arica-moderno.netlify.app'
]
# 1 forma estandard de autenticacion JWT token mas firma de rest_framework_simplejwt mediante token de autenticacionmas seguro
# 2 forma de autenticacion con token de rest_framework - menos seguro - ya no se usa en el proyecto
#  'rest_framework.authentication.TokenAuthentication',
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
      
      'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Configura los permisos por defecto en cada vista de la API en views.py (de otro modo se debe configurar en cada vista, hay que especificar que no se necesita autenticación cuando se quiere hacer Login o Registro de usuario)
    ]
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Configuraciones adicionales recomendadas
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,  # Firma los tokens JWT (JSON Web Tokens)
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',), # Credencial de autenticación que se espera en la cabecera de la petición que se enviara desde React al servidor de Django 
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',

    
    # Para manejar errores de token expirado
    'TOKEN_OBTAIN_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenObtainPairSerializer',
    'TOKEN_REFRESH_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenRefreshSerializer',
    'TOKEN_VERIFY_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenVerifySerializer',
    
    # Para permitir la actualización del token
    'UPDATE_LAST_LOGIN': True,
}
AUTH_USER_MODEL = 'backend.Usuario'
# CSRF_COOKIE_DOMAIN = 'localhost' # esto es para que el token csrf se envíe a la api en React desde el servidor de Django

# CSRF_COOKIE_NAME = "csrftoken" # esto es para que el token csrf se envíe a la api en React desde el servidor de Django
# CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN" # esto es para que el token csrf se envíe a la api en React desde el servidor de Django
# CSRF_USE_SESSIONS = False # esto es para que el token csrf se envíe a la api en React desde el servidor de Django

DEBUG = True # Cambiar a False en producción
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' # esto lo que hace es decirle a django que vamos a utilizar un servidor SMTP para enviar correos electrónicos
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'hotel.arica00@gmail.com' # dirección de correo electrónico desde la que se enviarán los correos electrónicos
EMAIL_HOST_PASSWORD = 'oxhegjlaaffvxzws'
ALLOWED_HOSTS = [] # esto es para que el token csrf se envíe a la api en React desde el servidor de Django