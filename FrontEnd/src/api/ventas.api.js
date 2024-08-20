import { createApiInstance } from './config/axiosConfig';

// Crear instancia de Axios para la API de ventas
const ventasApi = createApiInstance('usuarios/datos/v1/ventas');

export const getAllVentas = (token) => {
  return ventasApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
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
