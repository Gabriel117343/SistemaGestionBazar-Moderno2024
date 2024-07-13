import { createApiInstance } from './config/axiosConfig';

const productosPedidosApi = createApiInstance('usuarios/datos/v1/productos_pedidos') // la urls por defectos

export const getAllProductosPedidos = (token) => {
  return productosPedidosApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createProductoPedido = async (productoPedido, token) => {
  return productosPedidosApi.post('/', productoPedido, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deleteProductoPedido = (id, token) => {
  return productosPedidosApi.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateProductoPedido = (id, productoPedido, token) => {
  return productosPedidosApi.put(`/${id}/`, productoPedido, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const getProductoPedido = (id, token) => {
  return productosPedidosApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}