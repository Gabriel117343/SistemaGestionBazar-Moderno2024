import { createApiInstance } from './config/axiosConfig';

// Crear instancia de Axios para la API de ventas
const ventasApi = createApiInstance('usuarios/datos/v1/ventas');

export const getAllVentas = (parametros) => {
  return ventasApi.get('/', {
    params: {
      page: parametros.page,
      page_size: parametros.page_size,
      vendedor: parametros.vendedor,
      orden: parametros.orden,
      filtro: parametros.filtro
    },
   
  })
}

export const createVenta = async (venta, token) => {
  console.log(venta)
  console.log(token)
  return ventasApi.post('/', venta, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
