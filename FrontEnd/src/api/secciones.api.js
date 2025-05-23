import { createApiInstance } from './config/axiosConfig';

const seccionesApi = createApiInstance('usuarios/datos/v1/secciones') // la urls por defectos
// ESTE ES EL CRUD DE SECCIONES
export const getAllSecciones = ({ page, page_size, orden, filtro }) => {

  return seccionesApi.get('/', {
    params: {
      page,
      page_size,
      orden,
      filtro
    }
  })
}
export const getSeccion = (id, token) => {
  return seccionesApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const createSeccion = async (seccion, token) => {
  return seccionesApi.post('/', seccion, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
export const deleteSeccion = (id, token) => {
  return seccionesApi.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateSeccion = (id, seccion, token) => {
  return seccionesApi.put(`/${id}/`, seccion, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
