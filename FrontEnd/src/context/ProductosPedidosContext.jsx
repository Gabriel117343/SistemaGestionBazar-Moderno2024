import { createContext, useReducer } from 'react'
import { LoginContext } from './LoginContext'
import { ProductosPedidosReducer } from './reducers/ProductosPedidosReducer'
import { getAllProductosPedidos, createProductoPedido, deleteProductoPedido, updateProductoPedido, getProductoPedido } from '../api/productos_pedidos.api'
export const ProductosPedidosContext = createContext()

export const ProductosPedidosProvider = ({ children }) => {


  const initialState = {
    listaPedidos: [],
    pedidoSeleccionado: null
  }
  const [productosPedidosState, dispatch] = useReducer(ProductosPedidosReducer, initialState)

  const TOKEN_ACCESO = localStorage.getItem('accessToken'); 
  const getAllProductosPedidosContext = async () => {
    
    try {
      const res = await getAllProductosPedidos(TOKEN_ACCESO)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        console.log(res.data.data)
        dispatch({
          type: 'GET_PEDIDOS',
          payload: res.data.data
        })
      
        return ({ success: true, message: res.data.message })
      }
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  const crearProductoPedidoContext = async (productoPedido) => {
    const data = await createProductoPedido(productoPedido, TOKEN_ACCESO)
    try {
      if (data.status === 200 || data.status === 201) {
        dispatch({
          type: 'CREATE_PEDIDO',
          payload: data.data.data
        })
        return ({ success: true, message: data.data.message })
      }
    
    } catch (error) {
      return ({ success: false, message: error.response.data.error })
    
    }
  }
  const borrarProductoPedidoContext = async (id) => {
    await deleteProductoPedido(id, TOKEN_ACCESO)
    dispatch({
      type: 'DELETE_PEDIDO',
      payload: id
    })
  }
  const actualizarProductoPedidoContext = async (pedido) => {
    const data = await updateProductoPedido(pedido, TOKEN_ACCESO)
    dispatch({
      type: 'UPDATE_PEDIDO',
      payload: data
    })
  }
  const getProductoPedidoContext = async (id) => {
    const data = await getProductoPedido(id, TOKEN_ACCESO)
    dispatch({
      type: 'GET_PEDIDO',
      payload: data
    })
  }
  return (
    <ProductosPedidosContext.Provider value={{
      productosPedidosState,
      getAllProductosPedidosContext,
      crearProductoPedidoContext,
      borrarProductoPedidoContext,
      actualizarProductoPedidoContext,
      getProductoPedidoContext
    }}>
      {children}
    </ProductosPedidosContext.Provider>
  )
}