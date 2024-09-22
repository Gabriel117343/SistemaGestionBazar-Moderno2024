import { createApiInstance } from './config/axiosConfig';

const categoriasApi = createApiInstance('usuarios/datos/v1/categorias')


export const getAllCategorias = () => {
  return categoriasApi.get('/', {
    params: {
      page: 1,
      page_size: 100,
    }
  })
}