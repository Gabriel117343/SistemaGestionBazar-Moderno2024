// Import necessary modules and contexts
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

import { ProductosContext } from "../../../context/ProductosContext";
import { SeccionesContext } from "../../../context/SeccionesContext";
import { SidebarContext } from "../../../context/SidebarContext";

import { FiltroProductos } from "./FiltroProductos";
import { ValidarProductos } from "./ListaProductos";
import { PaginationButton } from "../../shared/PaginationButton";

import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
import { paginaPuntoVenta } from "@constants/defaultParams";
import CargaDeDatos from "../../../views/CargaDeDatos";
import "./puntoventa.css";

const TOTAL_SECTIONS_SHOW = {
  page: 1,
  page_size: 20,
};

export const PuntoVentaContainer = () => {
  const {
    stateProducto: { productos, cantidad },
    getProductosContext,
  } = useContext(ProductosContext);

  const {
    stateSeccion: { secciones },
    getSeccionesContext,
  } = useContext(SeccionesContext);

  const { sidebar } = useContext(SidebarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const calcularProductosMostrar = useCalculoProductosMostrar();

  const buscadorRef = useRef(null);
  const componenteProductosRef = useRef(null);

  // Function to get query parameters
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
      // si ya se ha definido el tamaño de la página no se modifica el estado
      if (parseInt(prevPageSize) === parseInt(newPageSize)) return
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

  // Fetch sections on component mount
  useEffect(() => {
    const cargarSecciones = async () => {
      const { success, message } =
        await getSeccionesContext(TOTAL_SECTIONS_SHOW);
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las secciones"
        );
      }
    };
    cargarSecciones();
  }, []);

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

  const cambiarPagina = ({ newPage }) => {
    const { page_size, incluir_inactivos, categoria, filtro, orden } =
      parametrosDeConsulta();

    setSearchParams({
      page: newPage,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(filtro && { filtro: filtro }),
    });
  };

  return (
    <div className="col-md-8">
      <FiltroProductos
        buscadorRef={buscadorRef}
        filtrarPorCategoria={filtrarPorCategoria}
        debounceFiltrarPorNombre={debounceFiltrarPorNombre}
        handleOrdenarChange={handleOrdenarChange}
        searchParams={searchParams}
        secciones={secciones}
        filtrarPorSeccion={filtrarPorSeccion}
        productos={productos}
      />
      {/* añadir esta section asegura que al montar el componente siempre se tengan las dimensiones correspondientes a la lista de productos a través de la referncia */}
      <section className="container-productos" ref={componenteProductosRef}>
        {isLoading ? (
          <CargaDeDatos />
        ) : (
          <ValidarProductos productos={productos} />
        )}
        <PaginationButton
          currentPage={searchParams.get("page") ?? 1}
          cambiarPagina={cambiarPagina}
          totalDatos={cantidad}
          cantidadPorPagina={
            searchParams.get("page_size") ?? paginaPuntoVenta.page_size
          }
        />
      </section>
    </div>
  );
};
