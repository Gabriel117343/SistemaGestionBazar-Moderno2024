// Contexto para un usuario Logeado
import { createContext, useReducer } from 'react'
import { LoginReducer } from './reducers/LoginReducer'
import { login, logout, getUser, refreshAccessToken } from '../api/usuarioLogin.api'
export const LoginContext = createContext()

export const LoginProvider = ({ children }) => {

  const initialState = {
    usuario: null,
    loading: false,
    isAuth: false
  }
  const [stateLogin, dispatch] = useReducer(LoginReducer, initialState)

  // ASI TENGO TODO EL CODIGO DE LOS USUARIOS EN UN SOLO LUGAR Y NO TENGO CREAR FUNCIONES EN CADA COMPONENTE QUE NECESITE HACER UNA PETICION AL SERVIDOR

  // UNICAMENTE SE PASAN LOS PARAMETROS QUE NECESITAN LAS FUNCIONES

  const iniciarSesion = async (usuario) => {
    try {
      const res = await login(usuario) // res para referenciarse al response del servidor
      console.log(res.data)
      if (res.status === 200) {
        const { access, refresh } = res.data
        // ------------------------------
        // token de acceso y token de refresco de JWT en el localStorage para mantener la sesion activa en el cliente y no perderla al recargar la pagina o cerrar el navegador(token de acceso expira en 15 minutos y el token de refresco en 7 dias en django)
        // ------------------------------
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        console.log(usuario)
        dispatch({
        type: 'LOGIN',
          payload: res.data.usuario
        })
      }

      return ({ success: true, message: res.data.message, rol: res.data.usuario.rol })
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error)
      return ({ success: false, message: error.response.data.error, tipo: error.response.data.tipo })
    }
  }
  const cerrarSesion  = async () => {
    const tokenAcceso = localStorage.getItem('accessToken');
    const tokenRefresco = localStorage.getItem('refreshToken');
    try {
      const res = await logout(tokenAcceso, tokenRefresco)
      console.log(res.data)
      if (res.status === 200) {
        console.log('first')
        // Independientemente del resultado de la API, limpia el estado local
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch({
          type: 'LOGOUT'
        })
        return ({ success: true, message: res.data.message })
      }
      
    } catch (error) {
      console.error(error)
      // Aun si hay un error, limpia el estado local, es una medida de seguridad
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return ({ success: false, message: error.response.data.error })
    }
  }
  const obtenerUsuarioLogeado = async () => {
    console.log('first');
    const tokenAcceso = localStorage.getItem('accessToken');
    const tokenRefresco = localStorage.getItem('refreshToken');
  
  
    try {
      let res = await getUser(tokenAcceso);
      console.log(res.data);
      if (res.status === 200) {
        dispatch({
          type: 'LOGIN',
          payload: res.data.usuario
        });
      }
    } catch (error) {

      if (error.response && error.response.status === 401) { // Suponiendo que 401 indica token expirado
        try {
          // Intenta obtener un nuevo token de acceso usando el refresh token
          const refreshRes = await refreshAccessToken(tokenRefresco);
  
          if (refreshRes.status === 200) {
            const tokenNew = refreshRes.data.access; // Actualiza el token de acceso
            localStorage.setItem('accessToken', tokenNew); // Guarda el nuevo token de acceso
            localStorage.setItem('refreshToken', refreshRes.data.refresh); // Guarda el nuevo token de refresco nuevo ya que el anterior se invalida al usarse para obtener un nuevo token de acceso

            // Intenta nuevamente la solicitud original ahora con el nuevo token de acceso
            const res = await getUser(tokenNew);

            if (res.status === 200) {
              dispatch({
                type: 'LOGIN',
                payload: res.data.usuario
              });
              return ({ success: true, message: res.data.message });
            }
          }
        } catch (refreshError) {
          console.error(refreshError);
          // Manejar el caso en que incluso el token de refresco es inválido o ha expirado
          return ({ success: false, message: refreshError.response.data.error });
        }
      } else {
        console.error(error);
        return ({ success: false, message: error.response.data.error });
      }
    }
  };
  return (
    <LoginContext.Provider value={{
      iniciarSesion,
      cerrarSesion,
      obtenerUsuarioLogeado,
      stateLogin
    }}>
    { children } 
    </LoginContext.Provider>
  )
}