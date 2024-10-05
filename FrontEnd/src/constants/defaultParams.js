// Cada página tendra unos parametros por defecto, que se pueden personalizar en el componente que los utilice.


export const paginaPuntoVenta = {

  mandatorios: {
    page: 1,
    page_size: 10,
    incluir_inactivos: false,
  },
  opcionales: {
    categoria: "all",
    orden: "all",
    seccion: "all",
    filtro: "",
  }
}
export const paginaProductos = {
  page: 1,
  page_size: 10,
  incluir_inactivos: true,
}

export const paginaStock = {
  page: 1,
  page_size: 10,
}
export const paginaUsuarios = {
  page: 1,
  page_size: 10,
}
export const paginaSecciones = {
  page: 1,
  page_size: 10,
}