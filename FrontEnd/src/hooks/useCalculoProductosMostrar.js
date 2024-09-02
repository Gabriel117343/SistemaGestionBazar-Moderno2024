import { useState, useEffect } from 'react';

function useCalculoProductosMostrar() {
  const [productosPorPagina, setProductosPorPagina] = useState(1);

  const calcularProductosMostrar = (componenteRef) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (componenteRef.current) {
          const { width, height } = componenteRef?.current?.getBoundingClientRect();
          const productoWidth = 171; // Ancho mínimo de cada producto
          const separacion = 20; // Separación entre productos
          const productoHeight = 200; // Alto fijo de cada producto (debes definirlo)
          console.log(width, height)
          const columnas = Math.floor(width / (productoWidth + separacion));
          console.log(columnas)
          
          const filas = Math.floor(height / productoHeight);
          console.log(filas)
          console.log(height)
          console.log(width)
          const totalProductos = columnas * filas;
          console.log(totalProductos)
          setProductosPorPagina(totalProductos);
          resolve(totalProductos);
        } else {
          resolve(5); // valor por defecto si no hay referencia
        }
      }, 1300)
      
    });
  };



  return { productosPorPagina, calcularProductosMostrar };
}

export default useCalculoProductosMostrar;