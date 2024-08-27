from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from PIL import Image
from django.db.models import JSONField # para campos JSON en la base de datos de SQLite
# en caso de utilizar postgresql, se debe importar de la siguiente manera:
# from django.contrib.postgres.fields import JSONField
from django.db import migrations
# Create your models here.
class Usuario(AbstractUser):
    ROLES = [
        ('vendedor', 'Vendedor'),
        ('administrador', 'Administrador'),
    ]
    rut = models.CharField(max_length=13)
    username = models.CharField(max_length=50, blank=True, null=True)
    nombre  = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email  = models.EmailField(max_length=50, unique=True, blank=False, null=False)
    USERNAME_FIELD = 'email' # el email es el campo que se usa para logearse
    REQUIRED_FIELDS = ['username']# email y password son requeridos por defecto
    telefono = models.CharField(max_length=15)
    jornada = models.CharField(max_length=10, choices=[('duirno', 'Duirno'), ('vespertino', 'Vespertino'), ('mixto', 'Mixto')], default='duirno')
    rol = models.CharField(max_length=15, choices=ROLES, default='vendedor')
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    ultima_actividad = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.nombre

# Modelo para los productos disponibles en el bazar
class Producto(models.Model):

    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255, default='Sin descripción')
    codigo = models.CharField(max_length=50, unique=True)
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, null=True, blank=True) # esto quiere decir que un producto pertenece a una categoria y una categoria puede tener muchos productos
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    #relacion con seccion
    seccion = models.ForeignKey('Seccion', on_delete=models.CASCADE) # esto quiere decir que un producto pertenece a una seccion y una seccion puede tener muchos productos
    proveedor = models.ForeignKey('Proveedor', on_delete=models.CASCADE) # esto quiere decir que un producto pertenece a un proveedor y un proveedor puede tener muchos productos
    estado = models.BooleanField(default=True)
    hash = models.CharField(max_length=255, default='Sin hash')
    # Otros campos relacionados con el producto
    def __str__(self):
        return '{0} - {1}'.format(self.nombre, self.categoria)
class Categoria(models.Model):

    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=255, default='Sin descripción')

    def __str__(self):
        return '{0}'.format(self.nombre)
    
class Proveedor(models.Model): # esto significa que cuando se agrege un producto se debe seleccionar un proveedor
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    nombre = models.CharField(max_length=100) # nombre del proveedor
    persona_contacto = models.CharField(max_length=100, blank=True, null=True) # persona de contacto del proveedor
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=50)
    estado = models.BooleanField(default=True)
    # Otros campos relacionados con el proveedor
    def __str__(self):
        return f'{self.nombre} - id {self.id}'
class Cliente(models.Model):
    #heredar del user con password y email

    email  = models.EmailField(max_length=50, unique=True, null=False,)

    nombre = models.CharField(max_length=50, blank=True, null=True)
    apellido = models.CharField(max_length=50, blank=True, null=True)
    rut = models.CharField(unique=True, max_length=13, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    # otros campos específicos del cliente aquí

    def __str__(self):
        return '{0} - {1}'.format(self.nombre, self.apellido)

class Pedido(models.Model):
    ESTADOS_PEDIDO = [
        ('pendiente', 'Pendiente'),    # Pedido creado, aún no enviado al proveedor.
        ('ordenado', 'Ordenado'),      # Pedido ha sido enviado al proveedor.
        ('enviado', 'Enviado'),        # El proveedor ha enviado el pedido.
        ('recibido', 'Recibido'),      # El pedido ha sido recibido en el bazar.
        ('cancelado', 'Cancelado'),    # Pedido cancelado por cualquier razón.
    ]
    # campo codigo que tiene el codigo del pedido ej: PO-0001 y se autoincrementa
    codigo = models.CharField(max_length=50, unique=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)  # Pedido hecho a un proveedor
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, default=1)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_PEDIDO, default='pendiente')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    impuesto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    observacion = models.TextField(blank=True, null=True, default='Sin observaciones')

    def __str__(self):
        return f'Pedido {self.id} - {self.proveedor.nombre} - {self.estado}'

class ProductoRecibido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='productos_recibidos', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    fecha_recibido = models.DateTimeField(auto_now=True)
    aceptado = models.BooleanField(default=False)
    

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre} - {self.pedido.proveedor.nombre}'
class ProductoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='productos', on_delete=models.CASCADE) # related_name es el nombre que se usa para acceder a los productos de un pedido, es una relación inversa
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100, default='Sin nombre')
    cantidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre}'
class Descuento(models.Model): # esto quiere decir que un descuento puede aplicarse a muchos productos y un producto puede tener muchos descuentos
    codigo = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)  # Porcentaje de descuento
    valido_desde = models.DateTimeField()
    valido_hasta = models.DateTimeField()
    productos = models.ManyToManyField(Producto)  # Los productos a los que se aplica el descuento
    
    def __str__(self):
        return self.codigo
# Modelo para representar las ventas realizadas
class Venta(models.Model):
    vendedor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    descuento = models.ForeignKey(Descuento, on_delete=models.SET_NULL, null=True, blank=True)
    # info_venta_json = JSONField(blank=True, null=True) 
    def __str__(self):
        return f'Venta {self.id} - Total {self.total}'

class Seccion(models.Model):
    nombre = models.CharField(max_length=100)
    numero = models.IntegerField(unique=True)
    descripcion = models.CharField(max_length=255, default='Sin descripción')
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    #relacion con producto
    def __str__(self):
        return '{0} - {1}'.format(self.nombre, self.numero)
  
class Movimiento(models.Model):
    TIPOS_MOVIMIENTO = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    ]
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    tipo = models.CharField(max_length=20, choices=TIPOS_MOVIMIENTO)
    seccion_origen = models.ForeignKey(Seccion, related_name='movimientos_origen', on_delete=models.CASCADE)
    seccion_destino = models.ForeignKey(Seccion, related_name='movimientos_destino', on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    razon = models.CharField(max_length=255)

    # Otros campos relevantes para la venta
class Stock(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE) # Quiere decir que un producto tiene un stock y un stock pertenece a un producto
    descripcion = models.CharField(max_length=255, default='Sin descripción')
    cantidad = models.IntegerField(default=0)
    

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre}'
class VentaCategoria(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    # atributos para poder filtrar la venta Categoria
    entidad_id = models.ForeignKey(Categoria, null=True, on_delete=models.SET_NULL) # el id de la categoria
    proveedor = models.ForeignKey(Proveedor, null=True, blank=True, on_delete=models.SET_NULL) # si se elimina ese proveedor se pone en null en vez de eliminar la ventaCategoria 
    producto = models.ForeignKey(Producto, null=True, blank=True, on_delete=models.SET_NULL)
    seccion = models.ForeignKey(Seccion, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Tipo {self.entidad_id}: {self.nombre}, {self.cantidad} items, Total: {self.total}"

class VentaProducto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE) # una venta puede tener muchos productos y un producto solo puede estar en una venta
    
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    # atributos para poder filtrar la venta Producto
    entidad_id = models.ForeignKey(Producto, null=True, on_delete=models.SET_NULL) # el id del producto
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL)
    proveedor = models.ForeignKey(Proveedor, null=True, blank=True, on_delete=models.SET_NULL)
    seccion = models.ForeignKey(Seccion, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Producto {self.entidad_id}: {self.nombre}, {self.cantidad} items, Total: {self.total}"

class VentaProveedor(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    # atributos para poder filtrar la venta Proveedor
    entidad_id = models.ForeignKey(Proveedor, null=True, on_delete=models.SET_NULL) # el id del proveedor
    producto = models.ForeignKey(Producto, null=True, blank=True, on_delete=models.SET_NULL)
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL)
    seccion = models.ForeignKey(Seccion, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Proveedor {self.entidad_id}: {self.nombre}, {self.cantidad} items, Total: {self.total}"

class VentaSeccion(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    # atributos para poder filtrar la venta Seccion
    entidad_id = models.ForeignKey(Seccion, null=True, on_delete=models.SET_NULL) # el id de la seccion
    producto = models.ForeignKey(Producto, null=True, blank=True, on_delete=models.SET_NULL)
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL)
    proveedor = models.ForeignKey(Proveedor, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Sección {self.entidad_id}: {self.nombre}, {self.cantidad} items, Total: {self.total}"
