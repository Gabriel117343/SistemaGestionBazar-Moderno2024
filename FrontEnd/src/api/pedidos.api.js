import { createApiInstance } from './config/axiosConfig';

const pedidosApi = createApiInstance('usuarios/datos/v1/pedidos') // la urls por defectos
export const getAllPedidos = (token) => {
  return pedidosApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const getPedido = (id, token) => {
  return pedidosApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createPedido = async (pedido, token) => {
  
  return pedidosApi.post('/', pedido, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deletePedido = (id, token) => {
  return pedidosApi.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updatePedido = (id, pedido, token) => {
  return pedidosApi.put(`/${id}/`, pedido, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
// API personalizada para cambiar el estado del pedido a recibido
export const recibirPedido = (id, token) => {
  
  return pedidosApi.put(`/${id}/recibir/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}