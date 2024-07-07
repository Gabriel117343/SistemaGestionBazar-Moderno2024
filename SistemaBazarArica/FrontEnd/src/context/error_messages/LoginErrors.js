const loginErrors = {
  credenciales: { titulo: "Credenciales Inválidas", icono: 'error' },
  cuenta: { titulo: "Cuenta Inactiva", icono: 'warning' },
  horario: { titulo: "Restricción de Horario", icono: 'info' },
  default: { titulo: "Error al iniciar sesión", icono: 'error' },
  defaultErrorMessage: "Hubo un error Inesperado al iniciar sesión, por favor inténtelo de nuevo."
};
export default loginErrors;