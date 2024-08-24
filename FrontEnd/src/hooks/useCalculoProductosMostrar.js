import { useState } from 'react'

function useCalculoProductosMostrar() {
  const [productosPorPagina, setProductosPorPagina] = useState(1)

  const calculoPaginas = (sidebar) => {
    // se define la cantidad de productos por pagina dependiendo si la pantalla es md o lg
    // si el sidebar esta abierto o cerrado y si esta en una resolucion de 1700px o 1900pxs
    if (window.innerWidth < 1500 || (sidebar && window.innerWidth < 1900)) {

      setProductosPorPagina(8)
    } else if (
      window.innerWidth >= 1500 &&
      window.innerWidth <= 1900 &&
      !sidebar
    ) {

      setProductosPorPagina(10)
    } else if (
      window.innerWidth >= 1900 &&
      !sidebar &&
      window.innerHeight >= 900
    ) {

      setProductosPorPagina(17)
    } else if (window.innerWidth >= 1900 && !sidebar) {


      setProductosPorPagina(12)
    } else {

      setProductosPorPagina(10)
    }
  }
  return {
    productosPorPagina,
    calculoPaginas
  }
}

export default useCalculoProductosMostrar
