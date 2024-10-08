import { createContext, useReducer } from 'react'
import { UsuariosReducer } from './reducers/UsuariosReducer'
import { getAllUsers, getUser, createUser, deleteUser, updateUser } from '../api/usuarios.api'

export const UsuariosContext = createContext() // creando el contexto de los usuarios para poder usarlo en cualquier componente

export const UsuariosProvider = ({ children }) => {

  const initialState = {
    usuarios: [],
    cantidad: 0,
    usuarioSeleccionado: null
  } // estado inicial de los usuarios para el Reducer de los usuarios

  const [stateUsuario, dispatch] = useReducer(UsuariosReducer, initialState) // creando el reducer de los usuarios

  // Funciones para los usuarios que se van a usar en los componentes que esten dentro del contexto de los usuarios (UsuariosProvider)

  // ASI TENGO TODO EL CODIGO DE LOS USUARIOS EN UN SOLO LUGAR Y NO TENGO QUE IMPORTAR LAS FUNCIONES EN CADA COMPONENTE QUE LAS NECESITE
  // UNICAMENTE SE PASAN LOS PARAMETROS QUE NECESITAN LAS FUNCIONES

  const TOKEN_ACCESO = localStorage.getItem('accessToken');
  const getUsuarios = async (props) => {
    // |page|, |page_size|, |filtro|, |orden|

    try {
      const res = await getAllUsers(props) // res para referenciarse al response del servidor
      console.log(res)
      if (res.status === 200) {
        dispatch({
          type: 'GET_USUARIOS',
          payload: {
            usuarios: res.data.results,
            cantidad: res.data.count,
            page: props.page,
            page_size: props.page_size,
          }
        })
        return ({ success: true, message: res.data.message })
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  const getUsuario = async (id) => {
    try {
      const res = await getUser(id, TOKEN_ACCESO)
      console.log(res)
      if (res.status === 200) {
        dispatch({
          type: 'GET_USUARIO',
          payload: res.data
        }) // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los usuarios
        return ({ success: true, message: res.data.message })
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor 
      return ({ success: false, message: error.response.data.error })
    }
  }
  const createUsuario = async (usuario) => {
    try {
      const res = await createUser(usuario, TOKEN_ACCESO)
      console.log(res)
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: 'CREATE_USUARIO',
          payload: res.data.data
        })
      }
      return ({ success: true, message: res.data.message }) // Se retorna un objeto con el mensaje de exito y el mensaje que se va a mostrar en el toast, el mensage vine del response del servidor
    } catch (error) { // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    } 
  }
  const deleteUsuario = async (id) => {
    try {
      const res = await deleteUser(id, TOKEN_ACCESO)
      console.log(res)
      if (res.status === 200) {

        dispatch({
          type: 'DELETE_USUARIO',
          payload: id // el id se pasara para que el reducer pueda filtrar los usuarios que no sean el que se quiere eliminar
        })
        return ({ success: true, message: res.data.message })
      }
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error }) // en caso de que no se pueda eliminar el usuario se retorna un objeto con el mensaje de error y el mensaje que se va a mostrar en el toast o Sweetaler2, el mensage vine del response del servidor
    }
  }
  const updateUsuario = async (id, usuario) => {
    console.log(TOKEN_ACCESO)
 
    try {
      const res = await updateUser(id, usuario, TOKEN_ACCESO)
      console.log(res)
      if (res.status === 200) {
        dispatch({
          type: 'UPDATE_USUARIO',
          payload: usuario // el usuario se pasara para que el reducer pueda actualizar el usuario que se modifico
        })
        return ({ success: true, message: res.data.message })
      }
    } catch (error) {
      console.error(error)
      return ({ success: false, message: error.response.data.error })
    }
  }
  // se retorna el contexto de los usuarios para que los componentes que esten dentro del contexto de los usuarios (UsuariosProvider) puedan acceder a las funciones y al estado global de los usuarios
  return (
    <UsuariosContext.Provider value={{
      stateUsuario,
      getUsuarios,
      getUsuario,
      createUsuario,
      deleteUsuario,
      updateUsuario }}>
      {children}
    </UsuariosContext.Provider>
  )
}