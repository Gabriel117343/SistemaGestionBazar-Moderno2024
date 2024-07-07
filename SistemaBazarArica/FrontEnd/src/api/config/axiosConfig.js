import axios from 'axios';

// AXIOS PERSONALIZADO PARA LA TODO EL PROYECTO

// Object.freeze() es una función que evita que un objeto sea modificado, es decir, que no se le puedan agregar, eliminar o modificar propiedades.
const API_URL = Object.freeze({
  desarrollo: 'http://127.0.0.1:8000',
  produccion: 'https://api.sistemabazararica.com',
  despliegue_local: 'https://dwq9c4nw-8000.brs.devtunnels.ms'
});
export const createApiInstance = (path='') => {
  const apiInstance = axios.create({
    baseURL: `${API_URL.despliegue_local}/${path}`
  });

  // Interceptor de solicitud para incluir el token de acceso
  // apiInstance.interceptors.request.use(config => {
  //   const token = localStorage.getItem('accessToken');
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  //   return config;
  // }, error => {
  //   return Promise.reject(error);
  // });

  // Interceptor de respuesta para manejar tokens de acceso caducados
  apiInstance.interceptors.response.use(response => {
    return response;
  }, async error => {
    console.log('- Volviendo a obtener token de acceso...')
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL.desarrollo}/usuarios/api/token/refresh/`, { "refresh": refreshToken }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        if (refresh) {
          localStorage.setItem('refreshToken', refresh);
        }
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Unable to refresh token', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  });

  return apiInstance;
};