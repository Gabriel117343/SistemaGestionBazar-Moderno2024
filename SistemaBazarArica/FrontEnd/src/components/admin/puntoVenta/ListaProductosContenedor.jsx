import React, { useContext, useEffect, useState } from 'react'
import { ProductosContext } from '../../../context/ProductosContext'
import { StocksContext } from '../../../context/StocksContext'
import { VentasContext } from '../../../context/VentasContext' // contexto de ventas
import { ClientesContext } from '../../../context/ClientesContext'
import { SeccionesContext } from '../../../context/SeccionesContext'
import { SidebarContext } from '../../../context/SidebarContext'
import { CarritoContext } from '../../../context/CarritoContext'
import { toast } from 'react-hot-toast'
import { ValidarProductos } from './ListaProductos'
import './puntoVenta.css'
export const ListaProductosContenedor = () => {
  const { stateProducto: { productos }, getProductosContext } = useContext(ProductosContext)
  const { getStocksContext } = useContext(StocksContext)
  const { createVentaContext } = useContext(VentasContext)
  const { getClientesContext } = useContext(ClientesContext)
  const { getSeccionesContext } = useContext(SeccionesContext)

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


  // 
  return (
    <section className=''>
   
      <ValidarProductos listaProductos={productos} />

    </section>
  )
}
