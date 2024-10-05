# Documentación del Hook personalizado `useMagicSearchParams`

## Introducción
El hook `useMagicSearchParams` es una herramienta personalizada diseñada para manejar eficientemente los parámetros de búsqueda en la URL dentro de aplicaciones React que utilizan `react-router-dom`.
Su principal objetivo es simplificar y centralizar la gestión de parámetros de búsqueda, especialmente en escenarios donde hay parámetros obligatorios y opcionales, proporcionando una manera consistente y reutilizable de filtrar datos basados en estos parámetros

## Motivación y Razones para su Creación

**Reducción de Código Redundante**: Antes de la creación de este hook, el manejo de parámetros de búsqueda requería código repetitivo en múltiples componentes. Al centralizar esta lógica, se reduce significativamente la cantidad de código necesario.

**Reutilización**: Al encapsular la lógica en un hook reutilizable, se facilita su uso en diferentes partes de la aplicación sin duplicar esfuerzos.

**Consistencia en la URL**: Mantiene un orden consistente de los parámetros en la URL, mejorando la legibilidad y la experiencia del usuario.

**Flexibilidad**: Maneja parámetros obligatorios y opcionales, y casos donde un parámetro tiene el valor "all", evitando redundancias en la URL.

**Mejora en la experiencia de Usuario**: Al mantener una estructura de URL consistente y limpiar parámetros innecesarios, se proporciona una navegación más intuitiva y eficiente.

## Funcionalides del Hook

### 1. Manejo de Parámetros Obligatorios y Opcionales

**parámetros Obligatorios(mandatory)**: Son aquellos que siempre deben estar presentes en la URL para asegurar el correcto funcionamiento de la aplicación (ejemplo: paginación)

**Parámetros Opcionales(optional)**: Son párametros adicionales que pueden o no estar presentes, como filtro y ordenamientos de datos.

### 2. Obtención de Parámetros Actuales

**Función `ObtenerParametros`**: Extrae y devuelve un objeto con los parámetros actuales de la URL que son relevantes para la aplicación, filtrando aquellos definidos en `mandatory` y `optional`.

### 3. Actualización de Parámetros

**Functión `actualizarParametros`**: Permite actualizar los parámetros de búsqueda de manera controlada, recibiendo nuevos valores y especificando cuáles parámetros deben mantenerse o eliminarse.

**Parámetros**: 
  - `newParams`: Objeto con los nuevos párametros a establecer.
  - `keepParams`: Objeto que indica qué parámetros deben mantenerse o eliminarse.

### 4. Limpieza de Parámetros

**Functión `limpiarParametros`**: Restablece los parámetros de búsqueda a sus valores obligatorios por defecto, eliminando cualquier parámetro opcional que pudiera estar presente.

### 5. Ordenamiento de Parámetros en la URL

**Función `ordenarParametros`**: Asegura que los parámetros en la URL sigan un orden predefinido, mejorando la consistencia y legibilidad de la URL.

### 6. Manejo de valores `all`

- Evita incluir en la URL parámetros que tengan el valor por defecto `all`, ya que sería redundante y no aporta información adicional, acaparando espacio inecesario en la URL.

### 7. Reutilización y Flexibilidad

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

### Función `calcularParametrosOmitidos`

```javascript

const calcularParametrosOmitidos = (newParams, keepParams) => {
  const parametros = obtenerParametros();
  const result = Object.assign({ ...parametros, ...newParams });
  const paramsFiltered = Object.keys(result).reduce((acc, key) => {
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
const limpiarParametros = () => {
  setSearchParams({
    ...mandatory,
  });
};
```
**Descripción**: Restablece los parámetros de búsqueda a los valores obligatorios por defecto

### Función ActualizarParametros

```javascript

const actualizarParametros = ({ newParams = {}, keepParams = {} } = {}) => {
  if (Object.keys(newParams).length === 0 && Object.keys(keepParams).length === 0) {
    console.error("Error: No se han enviado parámetros para actualizar");
    limpiarParametros(); 
    return;
  }
  const parametrosFinales = calcularParametrosOmitidos(newParams, keepParams);
  const parametrosOrdenados = ordenarParametros(parametrosFinales);
  setSearchParams(parametrosOrdenados);
};

```
**Descripción**: Actualiza los parámetros de búsqueda. Si no se proporcionan nuevos parámetros o parámetros a mantener, limpia los parámetros actuales.

**Notas Importantes**:

  - Se utiliza una técnica de pasar un objeto vacío por defecto en caso de no recibir argumentos, lo cual es una práctica común en JavaScript para evitar errores al desestructurar parámetros.
  
  - La función está diseñada para manejar llamadas como `actualizarParametros()` o `actualizarParametros({})`, similar a cómo funciona `setState` en `React`.

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
    
  }

  // Ejemplo de uso al limpiar los parámetros
  const resetearFiltros = () => {
    limpiarParametros();
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
    cargarProductos()
    }

   }, [searchParams]) // reactivo ante cambios

  // Otro componente ej: PaginacionButton.jsx
  
  const cambiarPagina = (newPage) => {
  
  actualizarParametros({
    { newParams: { page: newPage }},
  })
  }
  // ...
  
// Algún componente de filtro por nombre ej: SearchFilter.jsx
  return (
  <>
    <label htmlFor="filtro">
      Filtrar
    </label>
      <InputSearch
        ref={buscadorRef}
        id="filtro"
        defaultValue={searchParams.get("filtro")}
        placeholder="Ej: Laptop HP"
        onChange={(e) => debounceFiltrarPorNombre(e.target.value)}
      />
  </>

  )
};

```

**Descripción**: El hook se inicializa pasando los parámetros obligatorios y opcionales definidos previamente.

### Beneficios en el Componente

**Código Más Limpio y Mantenible**: Al delegar la gestión de los parámetros al hook, el componente se mantiene enfocado en la lógica específica de la interfaz y la interacción con el usuario.

**Reutilización**: El mismo hook puede ser utilizado en otros componentes simplemente proporcionando los parámetros obligatorios y opcionales correspondientes.

**Consistencia**: Al tener una única fuente de verdad para el manejo de los parámetros, se reduce el riesgo de inconsistencias y errores.

## Conclusión 

El hook  `useMagicSearchParams` es una solución robusta y flexible para manejar los parámetros de búsqueda en aplicaciones React. Al centralizar la lógica de gestión de parámetros, mejora la mantenibilidad del código, facilita la reutilización y proporciona una mejor experiencia de usuario al mantener una URL limpia y consistente.