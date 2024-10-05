# Documentación del Hook `useTransformarDatosVenta`

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


### `obtenerInfoVentaSeccion`
Un objeto ...

#### Ejemplo de uso
Recibira el carrito de compras una vez hecha la venta a través de un array de objetos con cada producto.

```javascript
  const carrito = [
  {
    id: 32,
    nombre: 'Mentas Ice',
    codigo: '384',
    categoria: {
      id: 3,
      nombre: 'otros'
    },
    precio: '550.00',
    estado: true,
    seccion: {
      id: 4,
      nombre: 'Vitrinas',
      numero: 4
    },
    proveedor: {
      id: 1,
      nombre: 'Cooperativa Colun',
    }
    stock: {
      id: 19,
      cantidad: 39
    },
    cantidad: 4
  },
  {
    id: 35,
    nombre: 'Pepsy 354ml',
    codigo: '669',
    categoria: {
      id: 1,
      nombre: 'bebidas'
    },
    precio: '750.00',
    estado: true,
    seccion: {
      id: 4,
      nombre: 'Vitrinas',
      numero: 4
    },
    proveedor: {
      id: 1,
      nombre: 'Cooperativa Colun',

    },
    stock: {
      id: 22,
      cantidad: 21
    },
    cantidad: 2
  },
  {
    id: 36,
    nombre: 'Brownie Nutra bien 62gr',
    codigo: '991',
    categoria: {
      id: 2,
      nombre: 'snacks'
    },
    precio: '1200.00',
    estado: true,
    seccion: {
      id: 4,
      nombre: 'Vitrinas',
      numero: 4
    },
    proveedor: {
      id: 1,
      nombre: 'Cooperativa Colun',

    },
    stock: {
      id: 23,
      cantidad: 13
    },
    cantidad: 2
  },
  {
    id: 37,
    nombre: 'Brownie Nutra bien 35gr',
    codigo: '998',
    categoria: {
      id: 2,
      nombre: 'snacks'
    },
    precio: '650.00',
    estado: true,
    seccion: {
      id: 4,
      nombre: 'Vitrinas',
      numero: 4
    },
    proveedor: {
      id: 1,
      nombre: 'Cooperativa Colun',

    },
    stock: {
      id: 24,
      cantidad: 10
    },
    cantidad: 1
  },
  {
    id: 50,
    nombre: 'Leche Soprole 1 Litro',
    codigo: '2393',
    categoria: {
      id: 1,
      nombre: 'bebidas'
    },
    precio: '1200.00',
    estado: true,
    seccion: {
      id: 24,
      nombre: 'Mesa de ofertas',
      numero: 5
    },
    proveedor: {
      id: 3,
      nombre: 'Soprole',

    },
    stock: {
      id: 27,
      cantidad: 7
    },
    cantidad: 1
  }
];

```
### Resultado esperado

el Hook retorna un array con tres objetos, cada uno representando la información de ventas agrupada por categoría, producto y proveedor respectivamente. 


``` javascript
  // La suma de la información detallada de la venta siempre será la misma 
   const resultado = [
  {
    categoria: [
      { entidad_id: 3, producto_id: 32, proveedor_id: 1, cantidad: 4, total: 2200 },
      { entidad_id: 1, producto_id: 35, proveedor_id: 1, cantidad: 3, total: 2700 },// $7950
      { entidad_id: 2, producto_id: 36, proveedor_id: 1, cantidad: 3, total: 3050 }
    ]
  },
  {
    producto: [
      { entidad_id: 32, categoria_id: 3, proveedor_id: 1, cantidad: 4, total: 2200 },
      { entidad_id: 35, categoria_id: 1, proveedor_id: 1, cantidad: 2, total: 1500 },
      { entidad_id: 36, categoria_id: 2, proveedor_id: 1, cantidad: 2, total: 2400 },// $7950
      { entidad_id: 37, categoria_id: 2, proveedor_id: 1, cantidad: 1, total: 650 },
      { entidad_id: 50, categoria_id: 1, proveedor_id: 3, cantidad: 1, total: 1200 }
    ]
  },
  {
    proveedor: [
      { entidad_id: 1, categoria_id: 3, producto_id: 32, cantidad: 9, total: 6750 },// $7950
      { entidad_id: 3, categoria_id: 1, producto_id: 50, cantidad: 1, total: 1200 }
    ]
  }
];

  ```