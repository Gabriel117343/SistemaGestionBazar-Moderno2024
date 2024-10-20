import { createApiInstance } from './config/axiosConfig';

const stocksApi = createApiInstance('usuarios/datos/v1/stocks') // la urls por defectos

export const getAllStocks = ({ page, page_size, filtro, proveedor, orden }) => {
  console.log(orden)
  return stocksApi.get('/', {
    params: {
      page: page,
      page_size: page_size,
      filtro: filtro,
      proveedor: proveedor,
      orden: orden
    }
  })
}
export const getStock = (id, token) => { // id del stock
  return stocksApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateStock = (id, stock, token) => {
  return stocksApi.put(`/${id}/`, stock, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
// recibir el stock, api personalizada
export const recibirStock = (id, cantidad, token) => {
  return stocksApi.put(`/${id}/recibir/`, cantidad, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
