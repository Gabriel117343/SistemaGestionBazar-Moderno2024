### useProductosSearchParams

`useProductosSearchParams` es un hook personalizado creado para manejar de manera centralizada los parámetros de búsqueda en la URL para productos. Este hook facilita la actualización y obtención de parámetros de búsqueda, permitiendo mantener la lógica de búsqueda desacoplada y reutilizable en otros contextos, como por ejemplo en hooks similares: `useUsuariosMostrar`, `useSeccionMostrar`, etc.

## Instalación

Asegúrate de tener instalado `react-router-dom` para poder utilizar `useSearchParams`.

```bash
npm install react-router-dom

```

## Uso del Hook 

El hook se utiliza para leer y modificar los parámetros de consulta en la URL, con el objetivo de controlar la lógica de filtrado, ordenamiento y paginación de los productos.

# Ejemplo de uso

A continuación se muestra cómo usar useProductosSearchParams para manejar los filtros y actualizaciones en un componente.

```javascript
import React, { useEffect } from 'react';
import { useProductosSearchParams } from '../../../hooks/useProductosSearchParams';
import { toast } from 'react-hot-toast';

export const FiltroProductos = ({ setIsLoading }) => {
  const { searchParams, obtenerParametros, actualizarParametros } = useProductosSearchParams();

  useEffect(() => {
    const cargarProductos = async () => {
      // Si no se ha definido el tamaño de la página, no se hace la petición
      if (!searchParams.get("page_size")) return;

      toast.loading("Cargando productos...", { id: "loading" });
      const parametros = obtenerParametros();
      console.log({ parametrosBuscandos: parametros });

      // Simulamos la petición al contexto para cargar productos
      const { success, message } = await getProductosContext(parametros);
      if (success) {
        toast.success(message ?? "Productos cargados", { id: "loading" });
        setIsLoading(false);
      } else {
        toast.error(message ?? "Ha ocurrido un error inesperado al cargar los productos", { id: "loading" });
      }
    };

    cargarProductos();
  }, [searchParams]);

  const filtrarPorCategoria = ({ idCategoria = "" }) => {
    const value = idCategoria === "all" ? "" : idCategoria;
    actualizarParametros({ page: 1, categoria: value });
  };

  return (
    <div>
      {/* Componente de filtro por categoría */}
      <button onClick={() => filtrarPorCategoria({ idCategoria: 'electronics' })}>Filtrar Electrónicos</button>
    </div>
  );
};
```

## Explicación

**searchParams**

Objeto que contiene los parámetros de búsqueda actuales de la URL. Este objeto se maneja a través de `useSearchParams` de `react-router-dom`.

**obtenerParametros()**

Devuelve un objeto con todos los parámetros actuales de la URL.

# Ejemplo

```javascript

const parametros = obtenerParametros();
console.log(parametros); // { page: '1', categoria: 'electronicos', orden: 'ascendente' }
```
**actualizarParametros(newParams, skipParams)**

Permite actualizar los parámetros de la URL. Se reciben dos objetos

**newParams**: Parámetros nuevos o actualizados, por ejemplo `{filtro: 'newFiltro, categoria: 'nuevaCategoria'}`.
**skipParams**: Parámetros opcionales que se desean omitir al actualizar.

# Ejemplo

```javascript
actualizarParametros({ page: 1, categoria: 'ropa' });
```

## Uso del spread Condicional

El hook utiliza la técnica de spread condicional para evitar la creación de múltiples variables, haciendo que la lógica sea más limpia y fácil de mantener (haunque más difícil de entender al principio). Esto facilita la actualización de parámetros sin sobreescribir aquellos que no deben ser modificados.

## Ejemplo

```javascript

const actualizarParametros = (newParams = {}, skipParams = {}) => {
    // se recibe como parametro un objeto por ej: { filtro: 'nuevoFiltro', categoria: 'nuevaCategoria' }
    
    if (Object.keys(obj).length === 0) return setSearchParams(); // significa que se quiere limpiar los parametros de busqueda
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
    }
    setSearchParams(parametros);
}
```

**Centralización de Lógica**: Toda la lógica de manejo de parámetros de búsqueda se encuentra centralizada en este hook, facilitando la reutilización y el mantenimiento del código.
**Flexibilidad**: La implementación permite crear hooks similares para manejar parámetros de búsqueda para diferentes entidades, como usuarios, secciones, etc.

## Ejemplo para hook similares 

**useUsuariosMostrar.js**
**useSeccionMostrar.js**