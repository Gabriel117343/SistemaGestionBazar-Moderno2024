import { createContext, useReducer } from 'react'

import { ProductosReducer } from './reducers/ProductosReducer'
import { getAllProductos, getProducto, createProducto, deleteProducto, updateProducto } from '../api/productos.api'

export const ProductosContext = createContext() // creando el contexto de los productos para poder usarlo en cualquier componente

export const ProductosProvider = ({ children }) => {

  const initialState = {
    productos: [],
    cantidad: 0,
    page_size: 0,
    productoSeleccionado: null
  } // estado inicial de los productos para el Reducer de los productos
  
  const [stateProducto, dispatch] = useReducer(ProductosReducer, initialState) // creando el reducer de los productos
  // ASI TENGO TODO EL CODIGO DE LOS USUARIOS EN UN SOLO LUGAR Y NO TENGO QUE IMPORTAR LAS FUNCIONES EN CADA COMPONENTE QUE LAS NECESITE
  // UNICAMENTE SE PASAN LOS PARAMETROS QUE NECESITAN LAS FUNCIONES

 
  const getProductosContext = async (props) => {
    '|incluir_inactivos|filtro|page|page_size|seccion|categoria|orden'

    try {
      const res = await getAllProductos(props) // res para referenciarse al response del servidor
      console.log(res)
      if (res.status === 200) {
        dispatch({
          type: 'GET_PRODUCTOS',
          payload: {
            productos: res.data.results,
            cantidad: res.data.count,

          },
        });
     
        return ({ success: true, message: res.data.message })
       
      }
      return ({ success: false, message: res.data.error })
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  const getProductoContext = async (id) => {
    try {
      const res = await getProducto(id)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: 'GET_PRODUCTO',
          payload: res.data
        }) // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los productos
             
        return ({ success: true, message: res.data.message })
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return ({ success: false, message: res.data.error })
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor 
      return ({ success: false, message: error.response.data.error })
    }
  }
  const crearProductoContext = async (producto) => {
    try {
      const res = await createProducto(producto)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: 'CREATE_PRODUCTO',
          payload: res.data.data
        })
        return ({ success: true, message: res.data.message })
      }
      return ({ success: false, message: res.data.error })
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  const eliminarProductoContext = async (id) => {

    try {
      const res = await deleteProducto(id)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: 'DELETE_PRODUCTO',
          payload: id
        })
        return ({ success: true, message: res.data.message })
      }
      return ({ success: false, message: res.data.error })
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  const actualizarProductoContext = async (id, producto) => {
    try {
      const res = await updateProducto(id, producto)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: 'UPDATE_PRODUCTO',
          payload: res.data.data
        })
        return ({ success: true, message: res.data.message })
      }
      return ({ success: false, message: res.data.error })
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  return (
    <ProductosContext.Provider value={{
      getProductosContext,
      getProductoContext,
      crearProductoContext,
      eliminarProductoContext,
      actualizarProductoContext,
      stateProducto
    }}>
      { children }
    </ProductosContext.Provider>
  )
}