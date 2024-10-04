import React, { useRef, useContext, useEffect } from "react";
import CategoriaFilter from "./CategoriaFilter";
import SearchFilter from "./SearchFilter";
import SeccionFilter from "./SeccionFilter";
import OrdenProductos from "./OrdenProductos";

import { debounce, orderBy } from "lodash";
import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
import { toast } from "react-hot-toast";

import { paginaPuntoVenta } from "@constants/defaultParams";
import { SidebarContext } from "../../../context/SidebarContext";
import { ProductosContext } from "../../../context/ProductosContext";

import { useProductosSearchParams } from "../../../hooks/useProductosSearchParams";

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

  const { searchParams, obtenerParametros, actualizarParametros } =
    useProductosSearchParams();

  const buscadorRef = useRef(null);

  const actualizarPageSize = (newPageSize) => {
    actualizarParametros({ page_size: newPageSize.page_size });
  };

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
    
      actualizarPageSize({ page_size: newPageSize });
    }
    calcular();
  }, [sidebar]);

  useEffect(() => {
    const cargarProductos = async () => {
      // si no se ha definido el tamaño de la página no se hace la petición
      if (!searchParams.get("page_size")) return;
      toast.loading("Cargando productos...", { id: "loading" });
      const parametros = obtenerParametros();
      console.log({parametrosBuscandos: parametros})
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
  const filtrarPorCategoria = ({ idCategoria = "" }) => {
    buscadorRef.current.value = "";
    const value = idCategoria === "all" ? "" : idCategoria;
    actualizarParametros({
      page: 1,
      categoria: value,
    }, { filtro: true });
  };

  const filtrarPorSeccion = ({ idSeccion = "" }) => {
    actualizarParametros({
      page: 1,
      seccion: idSeccion,
    });
  };

  const filtrarPorNombre = (filtro) => {
    actualizarParametros({
      page: 1,
      filtro: filtro,
    });
  };
  const debounceFiltrarPorNombre = debounce(filtrarPorNombre, 400);

  const handleOrdenarChange = (selectedOption = "") => {
    buscadorRef.current.value = "";

    const value = selectedOption === "all" ? "" : selectedOption;
    actualizarParametros({
      page: 1,
      orden: value,
    }, { filtro: true });
  };
  return (
    <>
      <div className="row pb-1">
        <CategoriaFilter
          filtrarPorCategoria={filtrarPorCategoria}
          searchParams={searchParams}
        />
        <SearchFilter
          buscadorRef={buscadorRef}
          debounceFiltrarPorNombre={debounceFiltrarPorNombre}
          handleOrdenarChange={handleOrdenarChange}
          searchParams={searchParams}
          cambiarModo={cambiarModo}
        />
        <OrdenProductos
          handleOrdenarChange={handleOrdenarChange}
          searchParams={searchParams}
          cambiarModo={cambiarModo}
          modoTabla={modoTabla}
        />
      </div>
      <SeccionFilter
        filtrarPorSeccion={filtrarPorSeccion}
        productos={productos}
        secciones={secciones}
        searchParams={searchParams}
      />
    </>
  );
};
