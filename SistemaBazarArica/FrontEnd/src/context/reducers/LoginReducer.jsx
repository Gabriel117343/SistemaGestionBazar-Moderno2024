
export const LoginReducer = (stateLogin, action) => {
  const { type, payload } = action
  // El payload son los datos del usuario que se logeo
  switch (type) {
    case 'LOGIN':
      return {
        ...stateLogin,
        usuario: payload,
        isAuth: true
      }
    case 'LOGOUT':
      return {
        ...stateLogin,
        usuario: null,
        isAuth: false
      }
    default:
      return stateLogin
  }
}
