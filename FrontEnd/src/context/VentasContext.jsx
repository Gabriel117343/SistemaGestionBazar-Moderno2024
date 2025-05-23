import { createContext, useReducer } from 'react'
import { VentasReducer } from './reducers/VentasReducer'
import { LoginContext } from '../context/LoginContext'
import { createVenta, getAllVentas } from '../api/ventas.api' // api de ventas
export const VentasContext = createContext()

export const VentasProvider = ({ children }) => {

  const initialState = {
    ventas: [],
    cantidad: 0,
    page: 0,
    page_size: 0,
    ventaSeleccionada: null,

  }
  const [stateVenta, dispatchVenta] = useReducer(VentasReducer, initialState)

  // Funciones para el CRUD
  // ASI TENGO TODAS LAS FUNCIONES QUE SE USARAN EN EL CRUD
  // PARA USARLAS EN LOS COMPONENTES

  const TOKEN_ACCESO = localStorage.getItem('accessToken')
  const createVentaContext = async (venta) => {
    
    try {
      const res = await createVenta(venta, TOKEN_ACCESO)
     
      if (res.status === 200 || res.status === 201) {
        dispatchVenta({ type: 'CREATE_VENTA', payload: res.data })
      }
      
      return { success: true, message: res.data.message }
    } catch (error) {
      return { success: false, message: error.response.data.message }
    }
  }
  const getVentasContext = async (parametros) => {


    try {
      const res = await getAllVentas(parametros)
      
      console.log({ ventas: res.data})
      if (res.status === 200) {
        dispatchVenta({ type: 'GET_VENTAS', payload: {
          ventas:  res.data.results,
          cantidad: res.data.count,
          page: parametros.page,
          page_size: parametros.page_size
        } })

        return { success: true, message: res.data.message }
      }
      return { success: false, message: res.data.message }
     
    } catch (error) {

      return { success: false, message: error.response.data.message }
    }
  }
  return ( 
    <VentasContext.Provider value={{
      stateVenta,
      createVentaContext,
      getVentasContext
    }}>
      {children}
    </VentasContext.Provider>
  )
}