from rest_framework import serializers
from .models import *
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Usuario para serializar los datos
        model = Usuario
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data): # este método es para crear un usuario con contraseña encriptada si es que se envía en la petición post desde la api en React
        user = Usuario.objects.create(
            email=validated_data['email'],
            rut=validated_data['rut'],
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],
            telefono=validated_data['telefono'],
            jornada=validated_data['jornada'],
            rol=validated_data['rol'],
            # otros campos aquí
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    def update(self, instance, validated_data): # este método es para actualizar un usuario con contraseña encriptada si es que se envía en la petición put desde la api en React
        instance.email = validated_data.get('email', instance.email)
        instance.rut = validated_data.get('rut', instance.rut)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.apellido = validated_data.get('apellido', instance.apellido)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.imagen = validated_data.get('imagen', instance.imagen)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.jornada = validated_data.get('jornada', instance.jornada)
        instance.rol = validated_data.get('rol', instance.rol)
        # otros campos aquí
        if 'password' in validated_data: # si se envía una contraseña en la petición put, se encripta y se guarda en la base de datos
            instance.set_password(validated_data['password'])
        instance.save()
        return instance

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Proveedor para serializar los datos
        model = Proveedor
        fields = '__all__'
class ClienteSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Cliente para serializar los datos
        model = Cliente
        fields = '__all__'

class ProductoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoPedido
        fields =  'id', 'pedido', 'producto', 'nombre', 'cantidad', 'precio'
class PedidoSerializer(serializers.ModelSerializer):
    productos = ProductoPedidoSerializer(read_only=True, many=True)  # Añade esta línea
    # many = True indica que se serializará una lista de objetos
    proveedor = ProveedorSerializer(read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'proveedor', 'usuario', 'fecha_pedido', 'estado', 'subtotal', 'descuento', 'impuesto', 'total', 'codigo', 'observacion', 'productos']
    
class DescuentoSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Descuento para serializar los datos
        model = Descuento
        fields = '__all__'
class UsuarioResumidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido']  # Asumiendo que 'nombre' es un campo en el modelo Usuario
class VentaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True) # se serializa el cliente de forma manual
    vendedor = UsuarioResumidoSerializer(read_only=True)  # Usar el nuevo serializador aquí


    class Meta: # metadatos del modelo Venta para serializar los datos
        model = Venta
        fields = ['id', 'cliente', 'vendedor', 'total', 'fecha_venta']

class SeccionSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Seccion para serializar los datos
        model = Seccion
        fields = '__all__'
class MovimientoSerializer(serializers.ModelSerializer):
    class Meta: # metadatos del modelo Movimiento para serializar los datos
        model = Movimiento

        fields = '__all__'

# ------------------- Api Stock (anidación de datos de producto)-------------------
class SeccionNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seccion
        fields = ['id', 'nombre']

class ProveedorNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre']

class ProductoStockSerializer(serializers.ModelSerializer):
    seccion = SeccionNombreSerializer(read_only=True)  # Usar SeccionNombreSerializer para obtener el id y nombre de la sección
    proveedor = ProveedorNombreSerializer(read_only=True)  # Usar ProveedorNombreSerializer para obtener el id y nombre del proveedor

    class Meta:  # metadatos del modelo ProductoStock para serializar los datos
        model = Producto
        fields = ['id', 'nombre', 'codigo', 'seccion', 'proveedor']

class StockSerializer(serializers.ModelSerializer):
    producto = ProductoStockSerializer(read_only=True)  # Anidar ProductoStockSerializer

    class Meta:
        model = Stock
        fields = ['id', 'cantidad', 'updated_at', 'producto']
# ------------------- Stock -------------------

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
class ProductoSerializer(serializers.ModelSerializer):
    proveedor = ProveedorSerializer(read_only=True) # se serializa el proveedor de forma manual
    # al establecer read_only=True, no se espera que el campo proveedor sea enviado en la petición post o put desde la api en React
    seccion = SeccionSerializer(read_only=True) # se serializa la seccion de forma manual
    stock = StockSerializer(read_only=True) # se serializa el stock de forma manual
    categoria = CategoriaSerializer(read_only=True)
    class Meta:
        model = Producto # metadatos del modelo Producto para serializar los datos
        # fields = '__all__' # se serializan todos los campos del modelo Producto
        # __all__ no toma en cuenta los campos many to many, por lo que se debe especificar los campos que se quieren serializar
        # en este caso la seccion y el proveedor son campos many to many, por lo que se deben serializar de forma manual
        # solo se incluiran el id, nombre y descripcion de la seccion y el proveedor no todos los campos
        fields = ['id', 'nombre', 'descripcion', 'codigo', 'categoria', 'precio', 'imagen', 'fecha_creacion', 'estado', 'seccion', 'proveedor', 'stock']
    

class SeccionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seccion
        fields = '__all__'

class VentaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaCategoria
        fields = ['entidad_id', 'nombre', 'cantidad', 'total']

class VentaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaProducto
        fields = ['entidad_id', 'nombre', 'cantidad', 'total']

class VentaProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaProveedor
        fields = ['entidad_id', 'nombre', 'cantidad', 'total']


# Para los Gráficos de Ventas
class VentaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaCategoria
        fields = '__all__'

class VentaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaProducto
        fields = '__all__'

class VentaProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaProveedor
        fields = '__all__'
class VentaSeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaSeccion
        fields = '__all__'