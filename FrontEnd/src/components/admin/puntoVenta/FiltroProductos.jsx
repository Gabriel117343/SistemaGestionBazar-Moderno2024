import React, { useRef, useContext, useEffect } from "react";
import CategoriaFilter from "./CategoriaFilter";
import SearchFilter from "./SearchFilter";
import SeccionFilter from "./SeccionFilter";
import OrdenProductos from "./OrdenProductos";

import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
import { toast } from "react-hot-toast";

import { paginaPuntoVenta } from "@constants/defaultParams";
import { SidebarContext } from "../../../context/SidebarContext";
import { ProductosContext } from "../../../context/ProductosContext";

export const FiltroProductos = ({
  componenteProductosRef,
  secciones,
  setIsLoading,
  cambiarModo,
  productos,
  modoTabla,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getProductosContext } = useContext(ProductosContext);
  const { sidebar } = useContext(SidebarContext);
  const calcularProductosMostrar = useCalculoProductosMostrar();

  const buscadorRef = useRef(null);

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaPuntoVenta.page,
      page_size: searchParams.get("page_size") ?? paginaPuntoVenta.page_size,
      filtro: searchParams.get("filtro") ?? "",
      categoria: searchParams.get("categoria") ?? "",
      seccion: searchParams.get("seccion") ?? "",
      incluir_inactivos:
        searchParams.get("incluir_inactivos") ??
        paginaPuntoVenta.incluir_inactivos,
      orden: searchParams.get("orden") ?? "",
    };
  };
  const actualizarPageSize = (newPageSize) => {
    const {
      page,
      page_size,
      incluir_inactivos,
      categoria,
      orden,
      seccion,
      filtro,
    } = parametrosDeConsulta();

    setSearchParams({
      page: page,
      page_size: newPageSize.page_size ?? page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(seccion && { seccion: seccion }),
      ...(filtro && { filtro: filtro }),
    });
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
      const parametros = parametrosDeConsulta();

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
  const filtrarPorCategoria = ({ idCategoria = "all" }) => {
    const { page_size, incluir_inactivos, orden, seccion } =
      parametrosDeConsulta();

    buscadorRef.current.value = "";
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(idCategoria !== "all" && { categoria: idCategoria }),
      ...(orden && { orden: orden }),
      ...(seccion && { seccion: seccion }),
    });
  };

  const filtrarPorSeccion = ({ idSeccion = "all" }) => {
    const { page_size, incluir_inactivos, categoria, orden, filtro } =
      parametrosDeConsulta();

    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      // operador spread condicional para mantener la categoria, orden y filtro si existen
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(idSeccion !== "all" && { seccion: idSeccion }),
      ...(filtro && { filtro: filtro }),
    });
  };

  const filtrarPorNombre = (filtro) => {
    const { page_size, incluir_inactivos, categoria, orden, seccion } =
      parametrosDeConsulta();
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      // se mantiene la categoria, orden y seccion si existen
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(seccion && { seccion: seccion }),
      ...(filtro && { filtro: filtro }),
    });
  };

  const debounceFiltrarPorNombre = debounce(filtrarPorNombre, 400);

  const handleOrdenarChange = (selectedOption) => {
    const { page_size, incluir_inactivos, categoria } = parametrosDeConsulta();

    buscadorRef.current.value = "";
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(selectedOption && { orden: selectedOption }),
    });
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
