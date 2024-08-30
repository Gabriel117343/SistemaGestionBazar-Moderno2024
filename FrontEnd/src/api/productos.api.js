import { createApiInstance } from './config/axiosConfig';

const productosApi = createApiInstance('usuarios/datos/v1/productos') // la urls por defectos

// ESTE ES EL CRU DDE PRODUCTOS

export const getAllProductos = ({ incluirInactivos, page, page_size, filtro }) => {
  return productosApi.get('/', {
    params: {
      incluir_inactivos: incluirInactivos ? 'si' : 'no',
      page: page,
      page_size: page_size,
      filtro: filtro,

    },
  
  })
}
export const getProducto = (id) => {
  return productosApi.get(`/${id}/`, {
   
  })
}
export const createProducto = async (producto) => {
  return productosApi.post('/', producto, {
    headers: {
      'Content-Type': 'multipart/form-data',

    }
  })
}
export const deleteProducto = (id) => {
  return productosApi.delete(`/${id}/`, {

  })
}
export const updateProducto = (id, producto) => {
  return productosApi.put(`/${id}/`, producto, {
    headers: {
      'Content-Type': 'multipart/form-data',
  
    }
  })
}
