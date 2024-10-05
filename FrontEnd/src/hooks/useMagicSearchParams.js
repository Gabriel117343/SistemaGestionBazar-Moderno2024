import { useSearchParams } from "react-router-dom";

// HOOK PERSONALIZADO CON TECNICAS AVANZADAS PARA MANEJAR LOS PARAMETROS DE BUSQUEDA DE LOS PRODUCTOS

export const useMagicSearchParams = ({ mandatory={}, optional={} }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const TOTAL_PARAMS_PAGE = { ...mandatory, ...optional };
  const PARAM_ORDER = Array.from(Object.keys(TOTAL_PARAMS_PAGE));

  const obtenerParametros = () => {
    // se extraen todos los parametros de la URL y se convierten en un objeto
    const paramsUrl = Object.fromEntries(searchParams.entries());

    const params = Object.keys(paramsUrl).reduce((acc, key) => {
      if (Object.hasOwn(TOTAL_PARAMS_PAGE, key)) {
        acc[key] = paramsUrl[key];
      }

      return acc;
    }, {});

    return params;
  };

  const calcularParametrosOmitidos = (newParams, keepParams) => {
    // Se calculan los parametros omitidos, es decir, los parametros que no se han enviado en la petición
    const parametros = obtenerParametros();
    const result = Object.assign({
      ...parametros,
      ...newParams,
    });
    const paramsFiltered = Object.keys(result).reduce((acc, key) => {
      // por defecto no se omiten ningún parametros a menos que se especifique en el objeto keepParams
      if (Object.hasOwn(keepParams, key) && keepParams[key] === false) {
        return acc;
        // Nota: no se añade el all a los parametros ya que es el valor por defecto y sería redundante agregarlo en la URL y enviarlo en la petición
      } else if (!!result[key] !== false && result[key] !== "all") {
        acc[key] = result[key];
      }

      return acc;
    }, {});

    return {
      ...mandatory,
      ...paramsFiltered,
    }
  };

  const ordenarParametros = (parametrosFiltrados) => {
    // se ordenan los parametros de acuerdo a la estructura para que persista con cada cambio de la URL, ej: localhost:3000/?page=1&page_size=10
    // Nota: Esto mejora visiblemente la experiencia de usuario
    const orderedParams = PARAM_ORDER.reduce((acc, key) => {
      if (Object.hasOwn(parametrosFiltrados, key)) {
        acc[key] = parametrosFiltrados[key];
      }

      return acc;
    }, {});
    return orderedParams;
  };

  const limpiarParametros = () => {
    // por defeto no se limpian los parametros obligatorios de la paginación ya que se perdería la paginación por defecto
    setSearchParams({
      ...mandatory,
    });
  };

  // Nota: asi la función limpiara los parametros en vez de seguir si se llamada por ej: actualizarParametros() o actualizarParametros({}) como lo hace un useState (setEstado())
  const actualizarParametros = ({ newParams = {}, keepParams = {}} = {}) => {
    // se recibe como parametro un objeto por ej: { filtro: 'nuevoFiltro', categoria: 'nuevaCategoria' }

  if (Object.keys(newParams).length === 0 && Object.keys(keepParams).length === 0) {
    console.error("Error: No se han enviado parámetros para actualizar");
    limpiarParametros(); 
    return;
  }

    const parametrosFinales = calcularParametrosOmitidos(newParams, keepParams);
    const parametrosOrdenados = ordenarParametros(parametrosFinales);
    setSearchParams(parametrosOrdenados);
  };
  return {
    searchParams,
    actualizarParametros,
    limpiarParametros,
    obtenerParametros,
  };
};
