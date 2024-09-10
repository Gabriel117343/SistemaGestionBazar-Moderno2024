import { createApiInstance } from './config/axiosConfig';

const productosApi = createApiInstance('usuarios/datos/v1/productos') // la urls por defectos

// ESTE ES EL CRU DDE PRODUCTOS

export const getAllProductos = ({ incluir_inactivos, page, orden, page_size, filtro, categoria, seccion }) => {


  return productosApi.get('/', {
    params: {
      incluir_inactivos: incluir_inactivos,
      page: page,
      page_size: page_size,
      filtro: filtro,
      categoria: categoria,
      seccion: seccion,
      orden: orden,
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
