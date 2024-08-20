import { createApiInstance } from './config/axiosConfig';

const clienteApi = createApiInstance('usuarios/datos/v1/clientes') // la urls por defectos
// Este es el CRUD de clientes
export const createCliente = async (cliente, token) => {
    return clienteApi.post('/', cliente, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    })
}
export const getAllClientes = (token) => {
  return clienteApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const getCliente = (id, token) => {
  return clienteApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}