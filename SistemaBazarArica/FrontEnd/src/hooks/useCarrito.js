import { useState, useContext } from 'react'
import { toast } from 'react-hot-toast'
import { CarritoContext } from '../context/CarritoContext'
// Hook personalizado para manejar el carrito de compras - CUSTOM HOOK REUTILIZABLE
// sera utilizado tanto para el Admin como para el Vendedor
export default function useCarrito ()  {
  const { carrito } = useContext(CarritoContext)

  
  const obtenerInfoVentaTipo = () => {
    const totalTiposCarrito = new Set(carrito.map(producto => producto.tipo))

    const infoVentaTipo = {} // reiniciar categoria cada vez
    console.log(totalTiposCarrito)
    for (let tipo of totalTiposCarrito) {

      const tipoEnCarrito = carrito.filter(prod => prod.tipo === tipo) // el total de productos de ese tipo

      // se suman la cantidad total por el tipo ej: bebidas(cocacola3L)(cantidad: 3) + bebidas(cocacola1.5L)(cantidad: 2) = 5
      const cantidad = tipoEnCarrito.reduce((acc, prod) => acc + prod.cantidad, 0)
      let total = 0

      for(let prod of tipoEnCarrito) {
        
        total += prod.cantidad * parseInt(prod.precio)
      }
      // ej: { bebidas: [{ cantidad: 3 }, { total: 3500 }] }
      infoVentaTipo[tipo] = [{ cantidad, cantidad}, { total, total }]
      
    }
    return infoVentaTipo
  }
  const obtenerInfoVentaProducto = () => {
    
    const totalProductosCarritoId = new Set(carrito.map(producto => producto.id))
    const infoVentaProducto = {}
    for(let id of totalProductosCarritoId) {
      // Ej: si tenemos Atun 35gr entonces calcularemos la cantidad y el total de la venta de ese producto del carrito por el id ya que el nombre "puede ser actualizado", ademas de que iterar sobre una cadena es mas costoso en terminos de rendimiento
      // El backend se encargara de calcular la suma historica de las ventas del producto para poder devolver datos para un grafico.
      console.log(id)
      const productoEnCarrito = carrito.filter(prod => prod.id === id)
      
      const cantidad = parseInt(productoEnCarrito[0].cantidad)
     
      let total = cantidad * productoEnCarrito[0].precio
      // ej: { 2: [{ cantidad: 3 }, { total: 2400 }] }
      infoVentaProducto[id] = [{ cantidad, cantidad }, { total, total }]
    }
    return infoVentaProducto
  }

 

  return (
    {
      // carrito,
      // agregarProductoCarrito,
      // eliminarProductoCarrito,
      // restarProductoCarrito,
      // vaciarCarrito,
      obtenerInfoVentaTipo,
      obtenerInfoVentaProducto
    }
  )
}
