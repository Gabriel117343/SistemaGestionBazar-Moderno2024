import { createApiInstance } from './config/axiosConfig';

const proveedoresApi = createApiInstance('usuarios/datos/v1/proveedores') // la urls por defectos
// ESTE ES EL CRUD DE PROVEEDORES 

export const getAllProveedores = (token) => {
  return proveedoresApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const getProveedor = (id, token) => {
  return proveedoresApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createProveedor = async (proveedor, token) => {
  return proveedoresApi.post('/', proveedor, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deleteProveedor = (id, token) => {
  return proveedoresApi.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateProveedor = (id, proveedor, token) => {
  return proveedoresApi.put(`/${id}/`, proveedor, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}