import { createApiInstance } from './config/axiosConfig';

const productosApi = createApiInstance('usuarios/datos/v1/productos') // la urls por defectos

// ESTE ES EL CRUD DE PRODUCTOS
export const getAllProductos = (token, incluirInactivos) => {
  return productosApi.get('/', {
    params: {
      incluir_inactivos: incluirInactivos ? 'si' : 'no'
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const getProducto = (id, token) => {
  return productosApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createProducto = async (producto, token) => {
  return productosApi.post('/', producto, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deleteProducto = (id, token) => {
  return productosApi.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateProducto = (id, producto, token) => {
  return productosApi.put(`/${id}/`, producto, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
