import { createApiInstance } from './config/axiosConfig';

const usuariosApi = createApiInstance('usuarios/datos/v1/usuarios')
// Este es el crud

// Authenticación basada en token JWT (Json Web Token) con Django Rest Framework (DRF) y React
export const getAllUsers = ({ page, page_size, orden, filtro }) => {
  // return axios.get("http://127.0.0.1:8000/usuarios/datos/v1/usuarios/") > anterior
  return usuariosApi.get('/', {
    params:  {
      page: page,
      page_size: page_size,
      orden: orden,
      filtro: filtro 
    }
  }) // > nueva forma
}
export const getUser = (id, token) => {
  return usuariosApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createUser = async (usuario, token) => { // es necesario enviar la imagen como parametro para que se pueda enviar al servidor
  return usuariosApi.post('/', usuario, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deleteUser = (id, token) => {
  return usuariosApi.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateUser = (id, usuario, token) => {
  return usuariosApi.put(`/${id}/`, usuario, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
