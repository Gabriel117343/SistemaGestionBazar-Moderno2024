import { useContext, useState, createContext, useEffect } from 'react'
import toast from 'react-hot-toast'

export const CarritoContext = createContext()

export const CarritoProvider = ({ children }) => {
  
  const initialState = JSON.parse(localStorage.getItem('carrito')) || []
  // no se usa useReducer 
  const [carrito, setCarrito] = useState(initialState)
  
  // mantener el estado haún cuando se recargue la página
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregarProductoCarrito = (producto) => {

    const productoEnCarrito = carrito.find(prod => prod.id === producto.id)
    const productoConStock = (producto.stock.cantidad - (productoEnCarrito?.cantidad ?? 0)) 

    if (productoConStock <= 0 || productoConStock === undefined) {
      toast.error('Producto sin stock disponible')
    } else if (productoEnCarrito) {
      const productoActualizado = carrito.map(prod => {
        if (prod.id === producto.id) {
          if (prod.cantidad === '0' || prod.cantidad === 0) {
            prod.cantidad = ''
          }
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

    if (productoEnCarrito.cantidad > 1) {
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
  const actualizarCantidadCarrito = (productoId, cantidad) => {
    if (parseInt(cantidad) < 0) {
      console.log('first')
      eliminarProductoCarrito(productoId)
      return
    } else {
      const productoActualizado = carrito.map(prod => {
        if (prod.id === productoId) {
          prod.cantidad = cantidad
          return prod
        } else {
          return prod
        }
      })
      setCarrito(productoActualizado)

    }
    
  }
  const vaciarCarrito = () => {
    setCarrito([])
  }
  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarProductoCarrito,
      eliminarProductoCarrito,
      restarProductoCarrito,
      vaciarCarrito,
      actualizarCantidadCarrito
    }}>{ children }</CarritoContext.Provider>
  )
}
