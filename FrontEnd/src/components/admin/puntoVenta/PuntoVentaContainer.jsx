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

  const categoriaRef = useRef(null);
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

  // Adjust page size based on sidebar changes
  useEffect(() => {
    async function calcular() {
      const newPageSize = await calcularProductosMostrar(
        componenteProductosRef,
        sidebar
      );
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
        page_size: newPageSize ?? page_size,
        incluir_inactivos: incluir_inactivos,
        ...(categoria && { categoria: categoria }),
        ...(orden && { orden: orden }),
        ...(seccion && { seccion: seccion }),
        ...(filtro && { filtro: filtro }),
      });
    }
    calcular();
  }, [sidebar]);

  // Fetch products whenever search parameters change
  useEffect(() => {
    const cargarProductos = async () => {
      toast.loading("Cargando productos...", { id: "loading" });

      if (!searchParams.get("page_size")) return;

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
        categoriaRef={categoriaRef}
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
          <ValidarProductos
            productos={productos}
            currentPage={searchParams.get("page") || 1}
            cambiarPagina={cambiarPagina}
            cantidadDatos={cantidad}
            pageSize={parseInt(searchParams.get("page_size"))}
          />
        )}
      </section>
    </div>
  );
};
