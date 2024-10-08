// Cada página tendra unos parametros por defecto, que se pueden personalizar en el componente que los utilice.

export const paginaPuntoVenta = {
  mandatorios: {
    page: 1,
    page_size: 10,
    incluir_inactivos: false,
  },
  opcionales: {
    categoria: 0,
    orden: "all",
    seccion: "all",
    filtro: "",
  },
};
export const paginaProductos = {
  mandatorios: {
    page: 1,
    page_size: 10,
    incluir_inactivos: true,
  },
  opcionales: {
    orden: "all",
    filtro: "",
  }
};

export const paginaStock = {
  page: 1,
  page_size: 10,
};
export const paginaUsuarios = {
  mandatorios: {
    page: 1,
    page_size: 10,
    incluir_inactivos: true,
  },
  opcionales: {
    orden: "all",
    filtro: "",
  },
};
export const paginaSecciones = {
  mandatorios: {
    page: 1,
    page_size: 10,
  },
  opcionales: {
    orden: "all",
    filtro: "",
  },
};
