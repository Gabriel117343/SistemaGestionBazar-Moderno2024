import { useState } from 'react'
import { toast } from 'react-hot-toast'
// Hook personalizado para manejar el carrito de compras - CUSTOM HOOK REUTILIZABLE
// sera utilizado tanto para el Admin como para el Vendedor
export default function useCarrito (initialCarrito=[])  {
  const [carrito, setCarrito] = useState(initialCarrito) // Inicialmente el carrito está vacío

  // Funciones para controlar el carrito
  // (separar en un contexto global y un hook personalizado para reutilizarlo en cualquier componente)
  const agregarProductoCarrito = (producto, stocks) => {
    // Se busca el producto en el carrito para saber si ya está agregado

    const productoEnCarrito = carrito.find(prod => prod.id === producto.id)

    const productoDisponible = stocks.find(stock => stock.producto.id === producto.id)
    const productoDisponibleCarrito = productoDisponible.cantidad - productoEnCarrito?.cantidad 

    if (productoDisponibleCarrito <= 0 || productoDisponible.cantidad === 0) {
      toast.error('Producto sin stock disponible')
    } else if (productoEnCarrito) {
      const productoActualizado = carrito.map(prod => {
        if (prod.id === producto.id) {
          prod.cantidad += 1
          return prod
        } else {
          return prod
        }
      })
      toast.success('Producto agregado al carrito')
      setCarrito(productoActualizado)

    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }
  const eliminarProductoCarrito = (productoId) => {
    const productoActualizado = carrito.filter(prod => prod.id !== productoId)
    setCarrito(productoActualizado)
  }
  const restarProductoCarrito = (productoId) => {
    // Se busca el producto en el carrito para saber si ya está agregado
    const productoEnCarrito = carrito.find(prod => prod.id === productoId)

    if (productoEnCarrito.cantidad >= 1) {
      const productoActualizado = carrito.map(prod => {
        if (prod.id === productoId) {
          prod.cantidad -= 1
          return prod
        } else {
          return prod
        }
      })
     
      setCarrito(productoActualizado)
    } else {
      eliminarProductoCarrito(productoId) // Si la cantidad es 1, se elimina el producto
    }
  }
  const vaciarCarrito = () => {
    setCarrito([])
  }
  // Funciones para calcular totales y cantidades de productos en el carrito
  // Asi sera posible obtener mas detalles de las ventas para usar esos datos en Graficos
  const calcularCantidadCategoria = () => {
    const cantidadCategoria = [] // reiniciar categoria cada vez
    const totalTiposCarrito = new Set(carrito.map(producto => producto.tipo))

    for (let tipo of totalTiposCarrito) {
      const cantidad = carrito.filter(prod => prod.tipo === tipo).reduce((acc, prod) => acc + prod.cantidad, 0)
      if (cantidad > 0) {
        cantidadCategoria.push({ tipo, cantidad })
      }
    }
    return cantidadCategoria
  }

  return (
    {
      carrito,
      agregarProductoCarrito,
      eliminarProductoCarrito,
      restarProductoCarrito,
      vaciarCarrito,
      calcularCantidadCategoria
    }
  )
}
