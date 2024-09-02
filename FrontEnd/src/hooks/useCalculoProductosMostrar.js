import { useState, useEffect } from "react";

function useCalculoProductosMostrar() {
  const [productosPorPagina, setProductosPorPagina] = useState(1);


  const calcularProductosMostrar = (componenteRef, sidebar) => {
    const tiempo = sidebar ? 800 : 500;

      setTimeout(() => {
        if (componenteRef.current) {
          const { width, height } =
            componenteRef?.current?.getBoundingClientRect();
          const productoWidth = 171; // Ancho mínimo de cada producto
          const separacion = 20; // Separación entre productos
          const productoHeight = 200; // Alto fijo de cada producto (debes definirlo)

          const columnas = Math.floor(width / (productoWidth + separacion));
          console.log(columnas);

          const filas = Math.floor(height / productoHeight);

          const totalProductos = columnas * filas;
          console.log(totalProductos);

          setProductosPorPagina(totalProductos);
      
        } else {
          // dado que al cargar el componente el ref no existe, se calcula la cantidad de productos por página de acuerdo al ancho de la ventana
          if (window.innerWidth < 1200 || window.innerHeight < 500) {
            console.log("first");
            setProductosPorPagina(6);
        
          } else if (window.innerWidth > 1200 && window.innerWidth < 1800) {
            setProductosPorPagina(8);
        
          } else {
            if (window.innerWidth > 1800 && window.innerHeight < 850) {
              setProductosPorPagina(10);
         
            } else {
              setProductosPorPagina(15);
            
            }
          }
        }
      }, tiempo);
 
  };

  return { productosPorPagina, calcularProductosMostrar };
}

export default useCalculoProductosMostrar;
