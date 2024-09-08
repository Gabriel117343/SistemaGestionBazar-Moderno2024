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
    baseURL: `${API_URL.desarrollo}/${path}`,
  });


  apiInstance.interceptors.request.use(config => {
    const patronLogin = /\/login/;
    // Si ya tiene un token de acceso en el header, no se agrega otro
    if (Object.hasOwn(config.headers, 'Authorization')) return config;
    // Si la solicitud es para el login, se elimina cualquier token de acceso que se tenga en el header
    if (patronLogin.test(config.baseURL)) {
      console.log('dfsjk')
      config.headers.Authorization = '';
      return config;
    }
    // en caso haya un token de accesso se agrega automáticamente al header de la solicitud
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // INTERCEPTOR DE RESPUESTA PARA SOLICITAR UN | TOKEN DE ACCESO (por consecuente uno de refreco también)| CUANDO ESTE EXPIRE Y SE OBTENGA UN 401 (NO AUTORIZADO) DE LA API DE DJANGO (después de recibir la respuesta)
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
        // se actualiza el token de acceso en el header de la solicitud original y se reenvia la solicitud
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