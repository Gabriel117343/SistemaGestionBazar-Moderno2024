import { createApiInstance } from './config/axiosConfig';

const proveedoresApi = createApiInstance('usuarios/datos/v1/proveedores') // la urls por defectos
// ESTE ES EL CRUD DE PROVEEDORES 

export const getAllProveedores = (parametros) => {
  return proveedoresApi.get('/', {
    params: {
      page: parametros.page,
      page_size: parametros.page_size,
      incluir_inactivos: parametros.incluir_inactivos,
      filtro: parametros.filtro,
      orden: parametros.orden,
      
    }
  })
}
export const getProveedor = (id, token) => {
  return proveedoresApi.get(`/${id}/`, {
   
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
  return proveedoresApi.delete(`/${id}/`, {
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