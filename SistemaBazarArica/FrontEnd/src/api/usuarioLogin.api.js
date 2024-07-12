import { createApiInstance } from './config/axiosConfig';
// PETICIONES ASINCRONAS PARA EL LOGIN, LOGOUT Y OBTENER USUARIO ACTUAL CON AXIOS PERSONALIZADO

const usuarioLoginApi = createApiInstance('usuarios/login')
const usuarioLogoutApi = createApiInstance('usuarios/logout')

const usuarioGetApi = createApiInstance('usuarios/get_usuario_logeado')
const usuarioRefreshTokenApi = createApiInstance('usuarios/api/token/refresh')

// Authenticación basada en token JWT (Json Web Token) con Django Rest Framework (DRF) y React

export const login = async (usuario) => {
  
  console.log('Logeandose...')
  return usuarioLoginApi.post('/', usuario, {
    headers: {
      'Content-Type': 'multipart/form-data'
      
    },
    timeout: 5000
  })
}
export const logout = async (accessToken, refreshToken) => {
  console.log(`-- Access Token: ${accessToken}, Refresh Token: ${refreshToken} --`);

  return usuarioLogoutApi.post('/', 
    { "refresh": refreshToken }, // Cuerpo de la solicitud
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
};
export const getUser = async (token) => {
  console.log('Obteniendo usuario actual...')
 
  return usuarioGetApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}` // se envia el token de autorizacion JWT en el header de la peticion
    },
    timeout: 5000 // el maximo de tiempo que se espera la respuesta es de 5 segundos de lo contrario se cancela la peticion
  })
}
export const refreshAccessToken = async (refreshToken) => {

  return usuarioRefreshTokenApi.post('/', { "refresh": refreshToken }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}