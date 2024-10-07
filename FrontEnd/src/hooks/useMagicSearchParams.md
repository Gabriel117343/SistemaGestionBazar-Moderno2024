# Documentación del Hook personalizado `useMagicSearchParams`🪄

## Introducción

El hook `useMagicSearchParams` es una herramienta personalizada diseñada para manejar eficientemente los parámetros de búsqueda en la URL dentro de aplicaciones React que utilizan `react-router-dom`.
Su principal objetivo es simplificar y centralizar la gestión de parámetros de búsqueda, especialmente en escenarios donde hay parámetros obligatorios y opcionales, proporcionando una manera consistente y reutilizable de filtrar datos basados en estos parámetros, combina el patrón `Clousure` llevado a un Hook para tener funciones privadas y publicas que serán retornadas.

## Motivación y Razones para su Creación

**Reducción de Código Redundante**: Antes de la creación de este hook, el manejo de parámetros de búsqueda requería código repetitivo en múltiples componentes. Al centralizar esta lógica, se reduce significativamente la cantidad de código necesario.

**Reutilización**: Al encapsular la lógica en un hook reutilizable, se facilita su uso en diferentes partes de la aplicación sin duplicar esfuerzos.

**Consistencia en la URL**: Mantiene un orden consistente de los parámetros en la URL, mejorando la legibilidad y la experiencia del usuario.

**Flexibilidad**: Maneja parámetros obligatorios y opcionales, y casos donde un parámetro tiene el valor "all", evitando redundancias en la URL.

**Conversión de Tipos de Datos**: Proporciona la opcion de convertir los parámetros de la `URL` (que siempre son cadenas de texto) a sus tipos originales, como números booleanos, según se definan en los parámetros obligatorios y opcionales.

**Mejora en la experiencia de Usuario**: Al mantener una estructura de URL consistente y limpiar parámetros innecesarios, se proporciona una navegación más intuitiva y eficiente.

## Funcionalides del Hook

### 1. Manejo de Parámetros Obligatorios y Opcionales

**parámetros Obligatorios(mandatory)**: Son aquellos que siempre deben estar presentes en la URL para asegurar el correcto funcionamiento de la aplicación (ejemplo: paginación)

**Parámetros Opcionales(optional)**: Son párametros adicionales que pueden o no estar presentes, como filtro y ordenamientos de datos.

### 2. Conversión de Tipos de Datos

**Función**: `convertirTiposOriginal` convierte los valores de los parámetros de la `URL` a sus tipos originales definidos en `mandatory` y `optional`.

**Opcionalidad de Conversión**: El desarrollador puede elegir si desea convertir los parámetros al obtenerlos, proporcionando flexibilidad según las necesidad del componente.

Nota: No se convierten parámetros de tipos fecha (Date), ya que su formato puede variar según el contexto y es mejor manejarlos directamente en el componente que los utiliza (por la zona horaria y bibliotecas que existen para su manejo eficiente).

### 3. Obtención de Parámetros Actuales

**Función `ObtenerParametros`**: Extrae y devuelve un objeto con los parámetros actuales de la URL que son relevantes para la aplicación, con la opción de convertirlos a sus tipos originales.

### 4. Actualización de Parámetros

**Functión `actualizarParametros`**: Permite actualizar los parámetros de búsqueda de manera controlada, recibiendo nuevos valores y especificando cuáles parámetros deben mantenerse o eliminarse.

**Parámetros**: 
  - `newParams`: Objeto con los nuevos párametros a establecer.
  - `keepParams`: Objeto que indica qué parámetros deben mantenerse o eliminarse.

### 5. Limpieza de Parámetros

**Functión `limpiarParametros`**: Restablece los parámetros de búsqueda a sus valores obligatorios por defecto o mantiene los parámetros obligatorios actuales en la `URL`, según se desee, por defecto se mantiene los parametros en la url ya que el usuario puede llegar a reescribirlos para mantener esos parametros.

### 6. Ordenamiento de Parámetros en la URL

**Función `ordenarParametros`**: Asegura que los parámetros en la URL sigan un orden predefinido, mejorando la consistencia y legibilidad de la `URL`.


### 7 Manejo de Valores por Defecto y Omisión de Parámetros Redundantes

  - Omite incluir en la `URL` parámetros que tengan valores por defecto o que no aportan información adicional (como aquellos con valor "all"), evitando redundancias en la URL y en las peticiones al servidor.

### 8. Reutilización y Flexibilidad

- El hook es reutilizable y puede adaptarse para manejar cualquier tipo de parámetros, siempre que se proporcionen los objetos de parámetros obligatorios y opcionales.

## Explicación Detallada del Código

A continuación, se describen las partes clave del hook, incluyendo notas y comentarios importantes.

### Importación Necesario

```javascript

import { useSearchParams } from "react-router-dom";

```
### Definición del Hook

```javascript

export const useMagicSearchParams = ({ mandatory = {}, optional = {} })
   //...
```

**Parámetros de Entrada**:
  - `mandatory`: Objeto con los parámetros obligatorios y sus valore por defecto.
  - `optional`: Objeto con los parámetros opcionales y sus valores por defecto.

### Variables Internas

  - `searchParams` y `setSearchParams`: Proporcionado por `useSearchParams`, permite leer y actualizar los parámetros de la URL.
  - `TOTAL_PARAMS_PAGE`: Combina los parámetros obligatorios y opcionales.
  - `PARAMS_ORDER`: Array con el orden de los parámetros, extraído de las claves de `TOTAL_PARAMS_PAGE`.
```javascript

  const TOTAL_PARAMS_PAGE = { ...mandatory, ...optional };
  const PARAM_ORDER = Array.from(Object.keys(TOTAL_PARAMS_PAGE));

```

### Functión `obtenerPrametros`

```javascript

const obtenerParametros = () => {
  const paramsUrl = Object.fromEntries(searchParams.entries());
  const params = Object.keys(paramsUrl).reduce((acc, key) => {
    if (Object.hasOwn(TOTAL_PARAMS_PAGE, key)) {
      acc[key] = paramsUrl[key];
    }
    return acc;
  }, {});
  return params;
};

```
**Descripción**: Extrae los parámetros actuales de la URL y los filtra para incluir solo aquellos definidos en `mandatory` y `optional`.


### Función `obtenerParametros`

```javascript

const obtenerParametros = ({ convertir = true } = {}) => {
  // Se extraen todos los parámetros de la URL y se convierten en un objeto
  const paramsUrl = Object.fromEntries(searchParams.entries());

  const params = Object.keys(paramsUrl).reduce((acc, key) => {
    if (Object.hasOwn(TOTAL_PARAMS_PAGE, key)) {
      acc[key] = convertir
        ? convertirTipoOriginal(paramsUrl[key], key)
        : paramsUrl[key];
    }
    return acc;
  }, {});

  return params;
};

```
**Descripción**: Extrae los parámetros actuales de la URL y los filtra para incluir solo aquellos definidos en mandatory y optional. Ofrece la opción de convertirlos a sus tipos originales.

### Función `calcularParametrosOmitidos`

```javascript

const calcularParametrosOmitidos = (newParams, keepParams) => {
  // Se calculan los parámetros omitidos, es decir, los que no se han enviado en la petición
  const parametros = obtenerParametros();
  const result = Object.assign({
    ...parametros,
    ...newParams,
  });

  const paramsFiltered = Object.keys(result).reduce((acc, key) => {
    // Por defecto, no se omite ningún parámetro a menos que se especifique en el objeto keepParams
    if (Object.hasOwn(keepParams, key) && keepParams[key] === false) {
      return acc;
    } else if (!!result[key] !== false && result[key] !== "all") {
      acc[key] = result[key];
    }
    return acc;
  }, {});

  return {
    ...mandatory,
    ...paramsFiltered,
  };
};


```
**Descripción**: Combina los parámetros actuales con los nuevos, elimina los que no deben mantenerse según `keepParams`, y excluye aquellos con valores no significativos `("all")`.

**Nota**: Siempre incluye los parámetros obligatorios para mantener la integridad de la URL.

### Función `ordenarParametros`

```javascript

const ordenarParametros = (parametrosFiltrados) => {
  const orderedParams = PARAM_ORDER.reduce((acc, key) => {
    if (Object.hasOwn(parametrosFiltrados, key)) {
      acc[key] = parametrosFiltrados[key];
    }
    return acc;
  }, {});
  return orderedParams;
};

```
**Descripción**: Reordena los parámetros filtrados según el orden definido en `PARAM_ORDER` para asegurar consistencia en la URL.
 
### Función limpiarParametros

```javascript

 const limpiarParametros = ({ mantenerParamsUrl = true } = {}) => {
    // por defeto no se limpian los parametros obligatorios de la paginación ya que se perdería la paginación

    setSearchParams({
      ...mandatory,
      // en caso se encuentren parametros en la URL reemplazarán los parametros mandatorios por defecto
      ...(mantenerParamsUrl && {
        ...(parametrosMandatoriosUrl()),
       
      }),
    });
  };

```
**Descripción**: Restablece los parámetros de búsqueda a los valores obligatorios por defecto o mantiene los parámetros obligatorios actuales que están en la URL, según el valor de `mantenerParamsUrl`.

### Función ActualizarParametros

```javascript

const actualizarParametros = ({ newParams = {}, keepParams = {} } = {}) => {
  // Validar si se han pasado parámetros
  if (
    Object.keys(newParams).length === 0 &&
    Object.keys(keepParams).length === 0
  ) {
    limpiarParametros();
    return;
  }

  const parametrosFinales = calcularParametrosOmitidos(newParams, keepParams);
  const parametrosOrdenados = ordenarParametros(parametrosFinales);
  setSearchParams(parametrosOrdenados);
};


```
**Descripción**: Actualiza los parámetros de búsqueda. Si no se proporcionan nuevos parámetros o parámetros a mantener, limpia los parámetros actuales.

### Retorno del Hook

```javascript

return {
  searchParams,
  actualizarParametros,
  limpiarParametros,
  obtenerParametros,
};

```
**Descripción**: Proporciona las funciones y variables necesarias para manejar los parámetros de búsqueda desde el componente que utiliza el hook.

## Ejemplo de Uso

A continuación, se muestra cómo implementar y utilizar el hook `useMagicSearchParams` en un componente React.

```javascript

export const paginaPuntoVenta = {

  // se especifican valores de tipo string, number, boolean etc.. , para el hook.
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


```
**Descripción**: Se definen los parámetros obligatorios y opcionales específicos para la página o componente.

### Implementación dn el Componente de Filtrado 

```javascript

import { useProductosSearchParams } from "../../../hooks/useProductosSearchParams";

export const FiltroProductos = (props) => {
  const { mandatorios, opcionales } = paginaPuntoVenta;
  const {
    searchParams,
    obtenerParametros,
    actualizarParametros,
    limpiarParametros,
  } = useProductosSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });

  // Resto del código del componente...

  // Ejemplo de uso de actualizarParametros al filtrar por categoría
  const filtrarPorCategoria = (idCategoria = "all") => {
    const newSearch = { page: 1, categoria: idCategoria };
    actualizarParametros(
      { newParams: newSearch },
      { keepParams: { filtro: false } } // Indica que no se desea mantener el filtro de búsqueda
    );
  };

  const filtrarPorNombre = (nombre = "") => {
    //...
  }

  // Ejemplo de uso al limpiar los parámetros
  const resetearFiltros = () => {
    limpiarParametros({ mantenerParamsUrl = true });
  };

  // alguna llamada a una Api
  useEffect(() => {
    async function cargarProductos () {
      toast.loading("Cargando productos...", { id: "loading" });
  
      const parametros = obtenerParametros();
      const { success, message } = await getProductosContext(parametros);
      if (success) {
        // ...
      } else {
        // ..
      }
  
    }
    cargarProductos()
   }, [searchParams]) // reactivo ante cambios

  
// Algún componente de filtro por nombre ej: SearchFilter.jsx

  const { page, page_size, filtro, categoria } = obtenerParametros({ convertir: true }) // se desea tener los valores en su tipo original ej: "1" a 1, "true" a true.
  return (
  <>
    <label htmlFor="filtro">
      Filtrar
    </label>
      <InputSearch
        ref={buscadorRef}
        id="filtro"
        // ❌ searchParams.get("filtro") > ya no es necesario acceder directamente a través del propio searchParams ya que puede entregar null o undefined
        defaultValue={filtro}
        placeholder="Ej: Laptop HP"
        onChange={(e) => debounceFiltrarPorNombre(e.target.value)}
      />
  </>

  )
};

```
### Ejemplo 2 - Componente de paginación

```javascript

import React from "react";

import { paginaPuntoVenta } from "@constants/defaultParams";
import { PaginationButton } from "../../shared/PaginationButton";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";

export const PaginacionProductos = ({ cantidad }) => {
  const { mandatorios, opcionales } = paginaPuntoVenta;
  const { obtenerParametros, actualizarParametros } = useMagicSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });
  const { page, page_size } = obtenerParametros();

  // se actualizan el parametro obligatorio page y no se omiten ningun parametro
  const cambiarPagina = ({ newPage }) => {
    actualizarParametros({ newParams: { page: newPage }, keepParams: {} });
  };

  return (
    <PaginationButton
      currentPage={page}
      cambiarPagina={cambiarPagina}
      totalDatos={cantidad}
      cantidadPorPagina={page_size}
    />
  );
};

```

### Justificación de No convertir Fechas 📅

No se realiza la conversión automática de parámetros de tipo fecha (Date) en la función obtenerParametros() porque:

**Variabilidad de Formatos**: Las fechas pueden necesitar ser interpretadas en diferentes formatos (ISO, timestamp, local, etc.) según el contexto.

**Control en el Componente**: Es más seguro y flexible manejar la conversión y validación de fechas directamente en el componente que las utiliza, permitiendo aplicar lógica específica según las necesidades (por ejemplo algúna biblioteca de manejo de fechas).

### Beneficios del uso del Hook en Componentes.

**1. ✅Código Más Limpio y Mantenible**: Al delegar la gestión de los parámetros al hook, el componente se mantiene enfocado en la lógica específica de la interfaz y la interacción con el usuario.

**2. ✅Reutilización**: El mismo hook puede ser utilizado en otros componentes simplemente proporcionando los parámetros obligatorios y opcionales correspondientes.

**3. ✅Consistencia**: Al tener una única fuente de verdad para el manejo de los parámetros, se reduce el riesgo de inconsistencias y errores.

**4. ✅Manejo seguro de parámetros**: La función `obtenerParametros` garantiza que siempre obtendrás valores válidos para los parámetros, evitando la posibilidad de acceder a valores no existentes.

**5. ✅Control sobre párametros obligatorios y opcionales**:  Puedes definir fácilmente cuáles parámetros son obligatorios y cuáles son opcionales, mejorando la consistencia y robustez de tu aplicación.

## Conclusión 

El hook  `useMagicSearchParams` es una solución robusta y flexible para manejar los parámetros de búsqueda en aplicaciones React. Al centralizar la lógica de gestión de parámetros, mejora la mantenibilidad del código, facilita la reutilización y proporciona una mejor experiencia de usuario al mantener una URL limpia y consistente.