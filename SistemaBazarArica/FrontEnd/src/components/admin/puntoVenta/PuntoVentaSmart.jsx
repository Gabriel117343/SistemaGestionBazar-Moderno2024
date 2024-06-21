import React, { useContext, useEffect } from 'react'
import { ProductosContext } from '../../../context/ProductosContext'
import { VentasContext } from '../../../context/VentasContext' // contexto de ventas
import { ClientesContext } from '../../../context/ClientesContext'
import { SeccionesContext } from '../../../context/SeccionesContext'
import { CarritoContext } from '../../../context/CarritoContext'
import { SidebarContext } from '../../../context/SidebarContext'
import useCarrito from '../../../hooks/useCarrito'
import { toast } from 'react-hot-toast'
import { ValidarProductos } from './ListaProductos'
import { Carrito } from './Carrito'
import swal from 'sweetalert2'
import './puntoVenta.css'
export const PuntoVentaSmart = () => {
  const { stateProducto: { productos }, getProductosContext, crearProductoContext } = useContext(ProductosContext)
  
  const { createVentaContext } = useContext(VentasContext)
  const { stateCliente: { clientes, clienteSeleccionado }, getClientesContext } = useContext(ClientesContext)
  const { stateSeccion: { secciones }, getSeccionesContext } = useContext(SeccionesContext)
  // Contexto de carrito
  const { carrito, agregarProductoCarrito, eliminarProductoCarrito, restarProductoCarrito, vaciarCarrito, actualizarCantidadCarrito } = useContext(CarritoContext)
  const { sidebar } = useContext(SidebarContext)
  const { obtenerInfoVentaTipo, obtenerInfoVentaProducto } = useCarrito()
  
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
  
  
  const realizarVenta = async () => {
    
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
    const productoConStock = (productos.find(prod => prod.id === idProducto).stock.cantidad - cantidad)
    // si la cantidad es menor o igual a 0, no se aumentar el stock en carrito
    if (productoConStock < 0) {
      toast.error('Producto sin stock disponible')
      return
    } else {
      actualizarCantidadCarrito(idProducto, cantidad)
    }
  }
  const agregarProducto = async(producto) => {
    const { success, message } = await agregarProductoCarrito(producto)
    toast.dismiss({ id: 'loading'}) // se cierra el toast de cargando
    if (success) {
      toast.success(message, { id: 'loading'} )
    } else {
      toast.error(message, { id: 'loading'})
    }
  }

  const datosListaProductos = { secciones, productos, carrito, sidebar }
  const funcionesListaProductos = { realizarVenta, agregarProducto }
  const datosCarrito = { carrito, clienteSeleccionado, clientes }
  const funcionesCarrito = { eliminarProductoCarrito, restarProductoCarrito, vaciarCarrito, realizarVenta, agregarProducto, actualizarCarrito }
  return (
    <section className='d-flex row'>
      <Carrito datos={{...datosCarrito}} funciones={{...funcionesCarrito}}/>
      <ValidarProductos datos={{...datosListaProductos}} funciones={{...funcionesListaProductos}} />

    </section>
  )
}
