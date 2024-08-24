# Documentación del Hook `useCalculoDatosVenta`

## Descripción
Este Hook sera útil para generar los datos tranformados sobre la información de las ventas, con el fin de ser enviados al Backend(django) para ser `Transformados`, poder recibirlos nuevamente en el FrotEnd y usarlos para mostrar Graficos de las ventas Historicas.

## Funciones

### `obtenerInfoVentaTipo`
Calcula la cantidad total y el total de ventas por tipo de producto en el carrito.

#### Retorno
Un objeto donde las claves son los tipos de productos y los valores son objetos con la cantidad total y el total de ventas de ese tipo.

#### Ejemplo de retorno
```javascript
{
  bebidas: { cantidad: 5, total: 3500 },
  lacteos: { cantidad: 6, total: 1700 },
}
```
### `obtenerInfoVentaProducto`
Calcula la cantidad total y el total de ventas para cada producto específico en el carrito, utilizando el ID del producto en lugar de su nombre ya que puede ser actualizado.

#### Retorno
Un objeto donde las claves son los IDs de los productos y los valores son objetos con la cantidad total y el total de ventas de ese producto.

#### Ejemplo de retorno
```javascript
{
  1: { cantidad: 3, total: 2400 }, 
  2: { cantidad: 2, total: 1800 },
}
