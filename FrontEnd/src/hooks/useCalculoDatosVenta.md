# Documentación del Hook `useCalculoDatosVenta`

## Descripción
Este Hook sera útil para generar los datos tranformados sobre la información de las ventas, con el fin de ser enviados al Backend(django) para ser `Transformados`, poder recibirlos nuevamente en el FrotEnd y usarlos para mostrar Graficos de las ventas Historicas.

## Funciones

### `obtenerInfoVentaTipo`
Calcula la cantidad total y el total de ventas por tipo de producto en el carrito.

#### Retorno
Un objeto donde las claves son los tipos de productos y los valores son objetos con la cantidad total y el total de ventas de ese tipo.


### `obtenerInfoVentaProducto`
Calcula la cantidad total y el total de ventas para cada producto específico en el carrito, utilizando el ID del producto en lugar de su nombre ya que puede ser actualizado.

#### Retorno
Un objeto donde las claves son los IDs de los productos y los valores son objetos con la cantidad total y el total de ventas de ese producto.

### `obtenerInfoVentaCategoria`
Un objeto ...

#### Ejemplo de uso
Recibira el carrito de compras una vez hecha la venta a través de un array de objetos con cada producto.

```javascript
  const carrito = [
    {
      id: 24,
      nombre: 'Papasfritas',
      descripcion: 'Sin descripción',
      codigo: '889',
      categoria: { id: 1, nombre: 'bebidas', descripcion: 'Sin descripción' },
      precio: '700.00',
      
      estado: true,
      seccion: {
        id: 26,
        nombre: 'Abarrotes',

        
      },
      proveedor: {
        id: 9,
        fecha_creacion: '2023-12-26T17:00:55.601398-03:00',
        nombre: 'lays',

      },
      stock: { id: 11, cantidad: 12, descripcion: 'Sin descripción' },
      cantidad: 2
    },
    {
      id: 27,
      nombre: 'Lays sabor Limon',
      descripcion: 'Sin descripción',
      codigo: '434',
      categoria: { id: 2, nombre: 'snacks', descripcion: 'Sin descripción' },
      precio: '700.00',

      estado: true,
      seccion: {
        id: 4,
        nombre: 'Vitrinas',

      },
      proveedor: {
        id: 9,
        fecha_creacion: '2023-12-26T17:00:55.601398-03:00',
        nombre: 'lays',

      },
      stock: { id: 14, cantidad: 22, descripcion: 'Sin descripción' },
      cantidad: 1
    },
    {
      id: 25,
      nombre: 'Coca Cola zero 1 litro',
      descripcion: 'Sin descripción',
      codigo: '777',
      categoria: { id: 1, nombre: 'bebidas', descripcion: 'Sin descripción' },
      precio: '1500.00',
    
      estado: true,
      seccion: {
        id: 24,
        nombre: 'Mesa de ofertas',

      },
      proveedor: {
        id: 8,
        fecha_creacion: '2023-12-23T00:39:38.173484-03:00',
        nombre: 'Coca Cola',

      },
      stock: { id: 12, cantidad: 41, descripcion: 'Sin descripción' },
      cantidad: 3
    },
    {
      id: 28,
      nombre: 'Arroz MIRAFLORES',
      descripcion: 'Sin descripción',
      codigo: '557',
      categoria: { id: 1, nombre: 'bebidas', descripcion: 'Sin descripción' },
      precio: '900.00',
    
      estado: true,
      seccion: {
        id: 27,
        nombre: 'Enlatados',
      
      },
      proveedor: {
        id: 9,
     
        nombre: 'lays',
   
      },
      stock: { id: 15, cantidad: 1, descripcion: 'Sin descripción' },
      cantidad: 1
    }
  ]
```
### Resultado esperado

el Hook retorna un array con tres objetos, cada uno representando la información de ventas agrupada por categoría, producto y proveedor respectivamente. 


``` javascript
    [
      {
        "categoria": [
          {
            "entidad_id": 1,
            "producto_id": 24,
            "seccion_id": 26,
            "cantidad": 6,
            "total": 6800
          },
          {
            "entidad_id": 2,
            "producto_id": 27,
            "seccion_id": 4,
            "cantidad": 1,
            "total": 700
          }
        ]
      },
      {
        "producto": [
          {
            "entidad_id": 24,
            "categoria_id": 1,
            "seccion_id": 26,
            "cantidad": 2,
            "total": 1400
          },
          {
            "entidad_id": 27,
            "categoria_id": 2,
            "seccion_id": 4,
            "cantidad": 1,
            "total": 700
          },
          {
            "entidad_id": 25,
            "categoria_id": 1,
            "seccion_id": 24,
            "cantidad": 3,
            "total": 4500
          },
          {
            "entidad_id": 28,
            "categoria_id": 1,
            "seccion_id": 27,
            "cantidad": 1,
            "total": 900
          }
        ]
      },
      {
        "proveedor": [
          {
            "entidad_id": 9,
            "categoria_id": 1,
            "producto_id": 24,
            "cantidad": 4,
            "total": 3000
          },
          {
            "entidad_id": 8,
            "categoria_id": 1,
            "producto_id": 25,
            "cantidad": 3,
            "total": 4500
          }
        ]
      }
    ]
  ```