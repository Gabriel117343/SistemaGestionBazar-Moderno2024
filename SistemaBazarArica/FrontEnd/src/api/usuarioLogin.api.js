import axios from 'axios'
const usuarioLoginApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/usuarios/login'

})

const usuarioLogoutApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/usuarios/logout'
})
const usuarioGetApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/usuarios/get_usuario_logeado'
})
const usuarioRefreshTokenApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/usuarios/api/token/refresh'
})

export const login = async (usuario) => {
  
  console.log('Logeandose...')
  return usuarioLoginApi.post('/', usuario, {
    headers: {
      'Content-Type': 'multipart/form-data'
      
    }
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
  console.log('Oteniendo usuario actual...')
 
  return usuarioGetApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}` // se envia el token de autorizacion JWT en el header de la peticion
    },
    timeout: 5000 // el maximo de tiempo que se espera la respuesta es de 5 segundos de lo contrario se cancela la peticion
  })
}
export const refreshAccessToken = async (refreshToken) => {
  console.log(refreshToken)
  return usuarioRefreshTokenApi.post('/', { "refresh": refreshToken }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}