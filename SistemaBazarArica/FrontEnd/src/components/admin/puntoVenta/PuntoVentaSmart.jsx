import React, { useContext, useEffect, useState } from 'react'
import { ProductosContext } from '../../../context/ProductosContext'
import { StocksContext } from '../../../context/StocksContext'
import { VentasContext } from '../../../context/VentasContext' // contexto de ventas
import { ClientesContext } from '../../../context/ClientesContext'
import { SeccionesContext } from '../../../context/SeccionesContext'
import { CarritoContext } from '../../../context/CarritoContext'
import useCarrito from '../../../hooks/useCarrito'
import { toast } from 'react-hot-toast'
import { ValidarProductos } from './ListaProductos'
import { Carrito } from './Carrito'
import { debounce } from 'lodash'
import swal from 'sweetalert2'
import './puntoVenta.css'
export const PuntoVentaSmart = () => {
  const { stateProducto: { productos }, getProductosContext } = useContext(ProductosContext)
  const { stateStock: { stocks}, getStocksContext } = useContext(StocksContext)
  const { createVentaContext } = useContext(VentasContext)
  const { stateCliente: { clientes, clienteSeleccionado }, getClientesContext } = useContext(ClientesContext)
  const { stateSeccion: { secciones }, getSeccionesContext } = useContext(SeccionesContext)
  // Contexto de carrito
  const { carrito, agregarProductoCarrito, eliminarProductoCarrito, restarProductoCarrito, vaciarCarrito, actualizarCantidadCarrito } = useContext(CarritoContext)
  
  const { obtenerInfoVentaTipo, obtenerInfoVentaProducto } = useCarrito()
  const [productosFiltrados, setProductosFiltrados] = useState(productos)
  // Cargar todos los productos, stocks, ventas, clientes y secciones al cargar el componente por primera vez
  useEffect(() => {
    const cargarProductos = async () => {
      const { success, message } = await getProductosContext()
      if (success) {
        // en caso de que message sea undefined, se asigna un mensaje por defecto para evitar errores
        
        toast.success(message ?? 'Productos cargados')
    
      } else {
        toast.error(message ?? 'Error al cargar los productos')
      }
     
    }
    cargarProductos()
  }, [])
  useEffect(() => {
    setProductosFiltrados(productos);
  }, [productos]); // Dependencia a 'productos'

  const resetearProductosFiltrados = () => {
    setProductosFiltrados(productos);
  }
  const agregarProducto = (producto) => {
    agregarProductoCarrito(producto, stocks)
  }
  
  useEffect(() => {
    const cargarStock = async () => {
      const { success, message } = await getStocksContext()
      if (!success) {
        toast.error(message ?? 'Error al cargar los stocks')
      }
    }
    cargarStock()
  }, [])

  useEffect(() => {
    const cargarClientes = async () => {
      const { success, message } = await getClientesContext()
      if (!success) {
        toast.error(message ?? 'Error al cargar los clientes')
      }
    }
    cargarClientes()
  }, [])
  useEffect(() => {
    const cargarSecciones = async () => {
      const { success, message } = await getSeccionesContext()
      if (!success) {
        toast.error(message ?? 'Error al cargar las secciones')
      }
    }
    cargarSecciones()
  }, [])
  // Funciones para filtrar productos
  const filtroTipo = (event) => {
    const tipo = event.target.value
    if (tipo === 'all') {
      setProductosFiltrados(productos)
      return
    }
    const productosFilt = productos.filter(producto => producto.tipo === tipo)
    setProductosFiltrados(productosFilt)
  }
  const filtroNombre = (event) => {
    const nombre = event.target.value
    
    const productosFilt = productos.filter(producto => producto.nombre.toLowerCase().includes(nombre.toLowerCase()))
    console.log(productosFilt)
    setProductosFiltrados(productosFilt)
  }
  
  const debounceFiltroNombre = debounce(filtroNombre, 300) // se le pasa la funcion y el tiempo de espera
  const filtrarPorSeccion = (id) => {
    const productosFiltrados = productos.filter(producto => producto.seccion.id === id)
    
    setProductosFiltrados(productosFiltrados)
  }
  const realizarVenta = async () => {
    console.log(carrito)
    console.log(clienteSeleccionado)
    const formVenta = new FormData()
    formVenta.append('cliente', clienteSeleccionado.id)
    formVenta.append('total', carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)) // total de la venta
    
    const infoVentaPorTipo = obtenerInfoVentaTipo()

    console.log(infoVentaPorTipo)
    const infoVentaPorProducto = obtenerInfoVentaProducto()
    console.log(infoVentaPorProducto)
    // antes de enviar se convierte a JSON para que el backend pueda leerlo
    formVenta.append('info_venta_tipo',JSON.stringify(infoVentaPorTipo))
    formVenta.append('info_venta_producto_id', JSON.stringify(infoVentaPorProducto))
   
    // agregar productos

    const { success, message } = await createVentaContext(formVenta)

    if (success) {
      vaciarCarrito()
      swal.fire({           
        title: 'Venta realizada',           
        text: message,            
        icon: 'success',            
        confirmButtonText: 'Aceptar',           
        confirmButtonColor: '#3085d6',            
      })
      
    } else {
      swal.fire({
        title: 'Error al realizar la venta',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      
      })
    }
    setOpcionCliente(true) // se vuelve a habilitar la opcion de seleccionar cliente
  }
  const actualizarCarrito = (idProducto, cantidad) => {
    console.log(idProducto, cantidad)
    if (parseInt(cantidad) <= 0 || cantidad === '') {
      eliminarProductoCarrito(idProducto)
      return
    
    }
    actualizarCantidadCarrito(idProducto, cantidad)

  }

  const datosListaProductos = { productosFiltrados, stocks, secciones, productos, carrito }
  const funcionesListaProductos = { debounceFiltroNombre, filtrarPorSeccion, filtroTipo, realizarVenta, resetearProductosFiltrados, agregarProducto }

  const datosCarrito = { carrito, clienteSeleccionado, clientes }
  const funcionesCarrito = { eliminarProductoCarrito, restarProductoCarrito, vaciarCarrito, realizarVenta, agregarProducto, actualizarCarrito }
  return (
    <section className='d-flex row'>
      <Carrito datos={{...datosCarrito}} funciones={{...funcionesCarrito}}/>
      <ValidarProductos datos={{...datosListaProductos}} funciones={{...funcionesListaProductos}} />

    </section>
  )
}
