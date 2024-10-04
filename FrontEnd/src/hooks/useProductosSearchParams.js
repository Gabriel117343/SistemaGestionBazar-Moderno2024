import { useSearchParams } from "react-router-dom";
import { paginaPuntoVenta } from "@constants/defaultParams";
// HOOK PERSONALIZADO CON TECNICAS AVANZADAS PARA MANEJAR LOS PARAMETROS DE BUSQUEDA DE LOS PRODUCTOS

export const useProductosSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const obtenerParametros = () => {
    // se extraen todos los parametros de la URL y se convierten en un objeto
    const params = Object.fromEntries(searchParams.entries());

    return {
      page: searchParams.get("page") ?? paginaPuntoVenta.page,
      page_size: searchParams.get("page_size") ?? paginaPuntoVenta.page_size,
      incluir_inactivos:
        searchParams.get("incluir_inactivos") ??
        paginaPuntoVenta.incluir_inactivos,
      // parametros de filtro
      // si no existe el parametro, se asigna un objeto vacio para no enviar ese filtro vacio en la petición
      ...(Object.hasOwn(params, "categoria")
        ? { categoria: params.categoria }
        : {}),
      ...(Object.hasOwn(params, "seccion") ? { seccion: params.seccion } : {}),
      ...(Object.hasOwn(params, "orden") ? { orden: params.orden } : {}),
      ...(Object.hasOwn(params, "filtro") ? { filtro: params.filtro } : {}),
    };
  };

  const actualizarParametros = (newParams = {}, skipParams = {}) => {
    // se recibe como parametro un objeto por ej: { filtro: 'nuevoFiltro', categoria: 'nuevaCategoria' }
    if (Object.keys(newParams).length === 0) return;
    const {
      page,
      page_size,
      incluir_inactivos,
      categoria,
      orden,
      seccion,
      filtro,
    } = obtenerParametros();

    // De esta forma se actualizan los que si se estan modificando, mientras se mantiene la estructura de los parametros que se ven en la URL
    // si no se modifica un parametro, se mantiene el que ya estaba en la URL
 
    const parametros = {
      page: page,
      page_size: newParams.page_size ?? page_size,
      incluir_inactivos: incluir_inactivos,
      // Nota: si al acceder al parametro que ya estaba en la URL es undefined, no se guardara al desestructurar
      // con esto se evita algo como { categoria: undefined } -> localhost:3000/?categoria=undefined&... o localhost:3000/?categoria=''&orden=''...
      ...(newParams.categoria && !skipParams?.categoria
        ? { categoria: newParams.categoria }
        : newParams.categoria === "" || !categoria || skipParams?.categoria
          ? {}
          : { categoria: categoria }),

      ...(newParams.orden && !skipParams?.orden
        ? { orden: newParams.orden }
        : newParams.orden === "" || !orden || skipParams?.orden
          ? {}
          : { orden: orden }),

      ...(newParams.seccion && !skipParams?.seccion
        ? { seccion: newParams.seccion }
        : newParams.seccion === "" || !seccion || skipParams?.seccion
          ? {}
          : { seccion: seccion }),

      ...(newParams.filtro && !skipParams?.filtro
        ? { filtro: newParams.filtro }
        : newParams.filtro === "" || !filtro || skipParams?.filtro
          ? {}
          : { filtro: filtro }),
    };
    setSearchParams(parametros);
  };

  return { searchParams, actualizarParametros, obtenerParametros };
};
