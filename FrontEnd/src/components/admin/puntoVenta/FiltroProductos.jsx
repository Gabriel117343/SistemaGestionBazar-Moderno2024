import React, { useRef, useContext, useEffect } from "react";
import CategoriaFilter from "./CategoriaFilter";
import SearchFilter from "./SearchFilter";
import SeccionFilter from "./SeccionFilter";
import OrdenProductos from "./OrdenProductos";

import { debounce } from "lodash";
import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
import { toast } from "react-hot-toast";

import { paginaPuntoVenta } from "@constants/defaultParams";
import { SidebarContext } from "../../../context/SidebarContext";
import { ProductosContext } from "../../../context/ProductosContext";

import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";

export const FiltroProductos = ({
  componenteProductosRef,
  secciones,
  setIsLoading,
  cambiarModo,
  productos,
  modoTabla,
}) => {
  const { getProductosContext } = useContext(ProductosContext);
  const { sidebar } = useContext(SidebarContext);
  const calcularProductosMostrar = useCalculoProductosMostrar();

  const { mandatorios, opcionales } = paginaPuntoVenta;
  const {
    searchParams,
    obtenerParametros,
    actualizarParametros,
    limpiarParametros,
  } = useMagicSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });

  const buscadorRef = useRef(null);

  useEffect(() => {
    async function calcular() {
      const prevPageSize = searchParams.get("page_size");
      const newPageSize = await calcularProductosMostrar(
        componenteProductosRef,
        sidebar
      );
      // para evitar casos donde se recargue la página con la misma url y el tamaño de la página sea el mismo
      if (parseInt(prevPageSize) === parseInt(newPageSize)) {
        // Nota: en strictMode el parametro page_size se actualizara 2 veces en la ruta, será un comportamiento normal
        console.log("Se mantiene el tamaño de la página");
        return;
      }
      const params = { page_size: newPageSize };
      actualizarParametros({ newParams: params, keepParams: {} });
    }
    calcular();
  }, [sidebar]);

  useEffect(() => {
    const cargarProductos = async () => {
      // si no se ha definido el tamaño de la página no se hace la petición
      if (!searchParams.get("page_size")) return;
      toast.loading("Cargando productos...", { id: "loading" });
      const parametros = obtenerParametros();
      console.log({ parametrosBuscandos: parametros });
      const { success, message } = await getProductosContext(parametros);
      if (success) {
        toast.success(message ?? "Productos cargados", { id: "loading" });
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos",
          { id: "loading" }
        );
      }
    };
    cargarProductos();
  }, [searchParams]);

  // Event handlers
  const filtrarPorCategoria = (idCategoria = "") => {
    buscadorRef.current.value = "";

    const newSearch = { page: 1, categoria: idCategoria };

    actualizarParametros(
      { newParams: newSearch },
      { keepParams: { filtro: false } } // indica que no se desea mantener el filtro de búsqueda
    );
  };

  const filtrarPorSeccion = (idSeccion = "") => {
    const newSearch = { page: 1, seccion: idSeccion };
    actualizarParametros({ newParams: newSearch });
  };

  const filtrarPorNombre = (filtro) => {
    const filtroLimpio = filtro.trim();

    actualizarParametros({ newParams: { page: 1, filtro: filtroLimpio } });
  };
  const debounceFiltrarPorNombre = debounce(filtrarPorNombre, 400);

  const handleOrdenarChange = (selectedOption = "") => {
    buscadorRef.current.value = "";

    const newSearch = { page: 1, orden: selectedOption };

    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    });
  };
  // es mejor acceder a los parametros de la URL una sola vez en vez de pasar el searchParams como prop y acceder de esta forma: searchParams.get("categoria")
  const { categoria, filtro, orden, page_size } = obtenerParametros();
  return (
    <>
      <div className="row pb-1">
        <CategoriaFilter
          filtrarPorCategoria={filtrarPorCategoria}
          categoriaActual={categoria}
        />
        <SearchFilter
          buscadorRef={buscadorRef}
          debounceFiltrarPorNombre={debounceFiltrarPorNombre}
          handleOrdenarChange={handleOrdenarChange}
          filtroActual={filtro}
          cambiarModo={cambiarModo}
        />
        <OrdenProductos
          handleOrdenarChange={handleOrdenarChange}
          ordenActual={orden}
          cambiarModo={cambiarModo}
          modoTabla={modoTabla}
        />
      </div>
      <SeccionFilter
        filtrarPorSeccion={filtrarPorSeccion}
        productos={productos}
        secciones={secciones}
        pageSizeActual={page_size}
      />
    </>
  );
};
