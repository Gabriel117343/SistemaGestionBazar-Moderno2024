# Documentación del Proceso de Realización de una Venta

** Desde la vista venta, hasta la transformación de la información detallada**

Este documento describe el proceso de realización de una venta en el sistema, destacando los puntos clave y las operaciones realizadas.

## (1) Proceso de Realización de una Venta

### Recepción de Datos de la Venta

Se recibe una solicitud de venta con los siguientes datos:

- **cliente_id**: Identificador del cliente que realiza la compra.
- **vendedor**: Usuario que realiza la venta.
- **total**: Precio total de la venta.
- **info_venta_json**: Información detallada de la venta en formato JSON (transformada en el FrontEnd).(solo se recive no se guarda en el modelo Venta)

### Uso de `transaction.atomic`

Se utiliza `transaction.atomic` para asegurar que todas las operaciones se realicen de manera atómica. Esto significa que si alguna operación falla, todas las operaciones se revierten, garantizando la integridad de los datos.

### Operaciones Clave

1. **Obtener los Productos Vendidos**  
   Se extraen los productos vendidos de `info_venta_json`.
   Ej:
  ```javascript
  // la suma de la información detallada de la venta siempre será la misma
  const json = [
  {
    "categoria": [
      { "entidad_id": 3, "producto_id": 32, "proveedor_id": 1, "cantidad": 4, "total": 2200 },
      { "entidad_id": 1, "producto_id": 35, "proveedor_id": 1, "cantidad": 3, "total": 2700 },// $7950
      { "entidad_id": 2, "producto_id": 36, "proveedor_id": 1, "cantidad": 3, "total": 3050 }
    ]
  },
  {
    "producto": [
      { "entidad_id": 32, "categoria_id": 3, "proveedor_id": 1, "cantidad": 4, "total": 2200 },
      { "entidad_id": 35, "categoria_id": 1, "proveedor_id": 1, "cantidad": 2, "total": 1500 },
      { "entidad_id": 36, "categoria_id": 2, "proveedor_id": 1, "cantidad": 2, "total": 2400 },// $7950
      { "entidad_id": 37, "categoria_id": 2, "proveedor_id": 1, "cantidad": 1, "total": 650 },
      { "entidad_id": 50, "categoria_id": 1, "proveedor_id": 3, "cantidad": 1, "total": 1200 }
    ]
  },
  {
    "proveedor": [
      { "entidad_id": 1, "categoria_id": 3, "producto_id": 32, "cantidad": 9, "total": 6750 },// $7950
      { "entidad_id": 3, "categoria_id": 1, "producto_id": 50, "cantidad": 1, "total": 1200 }
    ]
  }
  ]
  ```

2. **Actualizar el Stock de los Productos Vendidos**  
   Se actualiza el stock de cada producto vendido, decrementando la cantidad disponible en el inventario.

3. **Guardar los Detalles de la Venta**  
   Se guardan los detalles de la venta, incluyendo el cliente, el vendedor y el total de la venta.

4. **Actualizar la Información de la Venta**  
   Una vez realizada la venta, se actualiza la información de la venta. Esto incluye la creación de relaciones con las instancias de `VentaCategoria`, `VentaProducto`, `VentaProveedor` y `VentaSeccion`

# Proceso de Transformación de Datos de una Venta

Este documento describe el proceso de transformación de datos de una venta en el sistema, destacando cómo se crean las relaciones entre las diferentes entidades a través de las IDs recibidas en `info_venta_json`.

## (2) Proceso de Transformación de Datos de una Venta

### Recepción de Datos de la Venta

Se recibe un objeto `info_venta_json` que contiene la información detallada de la venta. Este objeto incluye listas de categorías, productos, proveedores y secciones, cada una con sus respectivas IDs y detalles.

### Creación de Relaciones

El proceso de transformación de datos implica la creación de relaciones entre las diferentes entidades (categorías, productos, proveedores y secciones) y la venta realizada. A continuación se describen los pasos clave:

#### Inicialización de Diccionarios

- Se inicializan diccionarios para almacenar la información de categorías, productos, proveedores y secciones.

#### Iteración sobre `info_venta_json`

- Se itera sobre cada elemento en `info_venta_json` para extraer y procesar la información de categorías, productos, proveedores y secciones.

#### Procesamiento de Categorías

- Para cada categoría en `info_venta_json`, se extraen las IDs de la categoría, producto, proveedor y sección.
- Se verifica si la categoría ya existe en el diccionario `info_categoria`. Si no existe, se crea una nueva entrada.
- Se actualizan la cantidad y el total de ventas para la categoría.

#### Procesamiento de Productos

- Para cada producto en `info_venta_json`, se extraen las IDs del producto, categoría, proveedor y sección.
- Se verifica si el producto ya existe en el diccionario `info_producto`. Si no existe, se crea una nueva entrada.
- Se actualizan la cantidad y el total de ventas para el producto.

#### Procesamiento de Proveedores

- Para cada proveedor en `info_venta_json`, se extraen las IDs del proveedor, categoría, producto y sección.
- Se verifica si el proveedor ya existe en el diccionario `info_proveedor`. Si no existe, se crea una nueva entrada.
- Se actualizan la cantidad y el total de ventas para el proveedor.

#### Procesamiento de Secciones

- Para cada sección en `info_venta_json`, se extraen las IDs de la sección, categoría, producto y proveedor.
- Se verifica si la sección ya existe en el diccionario `info_seccion`. Si no existe, se crea una nueva entrada.
- Se actualizan la cantidad y el total de ventas para la sección.

### Guardado de Instancias

- Se guardan las instancias de `VentaCategoria`, `VentaProducto`, `VentaProveedor` y `VentaSeccion` utilizando los datos almacenados en los diccionarios.

# (3) Vistas para el Dashboard de Ventas del Frontend

Con los datos transformados, se puede acceder a ellos a través de estas vistas. Estas vistas permiten filtrar las ventas por categoría, producto, proveedor y sección, además de filtrar por rango de fechas.

## Ejemplo de Uso
``` http://127.0.0.1:8000/usuarios/ventas_categoria/?fecha_inicio=2024-08-26&fecha_fin=2024-08-28 ```

### Parámetros de Consulta

- **fecha_inicio**: Fecha de inicio del rango de fechas (formato `YYYY-MM-DD`).
- **fecha_fin**: Fecha de fin del rango de fechas (formato `YYYY-MM-DD`).
- **categoria_id**: ID de la categoría para filtrar.
- **proveedor_id**: ID del proveedor para filtrar.
- **producto_id**: ID del producto para filtrar.
- **seccion_id**: ID de la sección para filtrar.


