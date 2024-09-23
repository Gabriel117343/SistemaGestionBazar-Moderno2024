import "./puntoventa.css";
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";

import { ProductosContext } from "../../../context/ProductosContext";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { debounce, set } from "lodash";

import { ValidarProductos } from "./ListaProductos";
import { useSearchParams } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";

import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
// import { withLoadingImage } from '../../../hocs/withLoadingImage'
import { CategoriaSelect } from "../../shared/CategoriaSelect";
import { SeccionButton } from "../../shared/SeccionButton";
import { paginaPuntoVenta } from "@constants/defaultParams";
import { ordenPorProductosVenta } from "@constants/defaultOptionsFilter";
export const FiltroProductos = () => {
  const {
    stateProducto: { productos, cantidad },
    getProductosContext,
  } = useContext(ProductosContext);
  const { sidebar } = useContext(SidebarContext);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const calcularProductosMostrar = useCalculoProductosMostrar(); // Obtiene la cantidad de productos por página

  const categoriaRef = useRef(null);
  const buscadorRef = useRef(null);

  const componentProductosRef = useRef(null);

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaPuntoVenta.page,
      page_size: searchParams.get("page_size") ?? paginaPuntoVenta.page_size,
      filtro: searchParams.get("filtro") ?? "",
      categoria: searchParams.get("categoria") ?? "",
      seccion: searchParams.get("seccion") ?? "",
      incluir_inactivos: searchParams.get("incluir_inactivos") ?? paginaPuntoVenta.incluir_inactivos,
      orden: searchParams.get("orden") ?? "",
    };
  };

  useEffect(() => {
    async function calcular() {
      const newPageSize = await calcularProductosMostrar(
        componentProductosRef,
        sidebar
      );
      const { page, page_size, incluir_inactivos, categoria, orden, seccion, filtro,  } = parametrosDeConsulta();
      console.log({ incluir_inactivos: incluir_inactivos });
      setSearchParams({
        page: page,
        page_size: newPageSize ?? page_size,
        incluir_inactivos: incluir_inactivos,
        // Propagación condicional de objetos, solo se agregara si hay un filtro activo o una categoria activa
        ...(categoria && { categoria: categoria }),
        ...(orden && { orden: orden }),
        ...(seccion && { seccion: seccion }),
        ...(filtro && { filtro: filtro }),
      });
    }
    calcular();
  }, [sidebar]);

  useEffect(() => {
    const cargarProductos = async () => {
      toast.loading("Cargando productos...", { id: "loading" });

      if (!searchParams.get("page_size")) return; // si no hay un page_size no se hace nada

      const parametros = parametrosDeConsulta();

      const { success, message } = await getProductosContext(parametros);
      if (success) {
        toast.success(message ?? "Productos cargados", { id: "loading" });
        setIsLoading(false); // se desactiva el componente de carga
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos",
          { id: "loading" }
        );
      }
    };

    cargarProductos();
  }, [searchParams]); // si los parametros de busqueda cambian se vuelve a cargar los productos


  const filtrarPorCategoria = ({ idCategoria = 'all' }) => {
    const { page_size, incluir_inactivos, orden, seccion } = parametrosDeConsulta();

    buscadorRef.current.value = "";
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      // Propagación condicional de objetos
      ...(idCategoria !== "all" && { categoria: idCategoria }),
      ...(orden && { orden: orden }),
      ...(seccion && { seccion: seccion }),
    });
  }

  const filtrarPorSeccion = ({ idSeccion = 'all' }) => {

    const { page_size, incluir_inactivos, categoria, orden, filtro } = parametrosDeConsulta();

    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(idSeccion !== "all" && { seccion: idSeccion }),
      ...(filtro && { filtro: filtro }),

    });
  }
  const filtrarPorNombre = (filtro) => {
    const { page_size, incluir_inactivos, categoria, orden, seccion } = parametrosDeConsulta();
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(seccion && { seccion: seccion }),
      ...(filtro && { filtro: filtro }),
    });
  }

  const debounceFiltrarPorNombre = debounce(filtrarPorNombre, 400);

  const handleOrdenarChange = (selectedOption) => {

    const { page_size, incluir_inactivos, categoria, filtro } = parametrosDeConsulta();

    buscadorRef.current.value = "";
    setSearchParams({
      page: 1,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      // Propagación condicional de objetos, solo se agregara si hay un filtro activo o una categoria activa
      ...(categoria && { categoria: categoria }),
      ...(selectedOption && { orden: selectedOption }),
   
    });
  };

  const cambiarPagina = ({ newPage }) => {

    const { page_size, incluir_inactivos, categoria, filtro, orden } = parametrosDeConsulta();
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
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-3  d-flex justify-content-center align-items-center gap-2">
            <label htmlFor="categoriaSelect">Categoría </label>
            <CategoriaSelect parametroCategoria={searchParams.get('categoria')} ref={categoriaRef} filtroCategoria={filtrarPorCategoria} />
          </div>
          <div className="col-md-9 d-flex justify-content-center align-items-center gap-2">
            <label htmlFor="buscarSelect">   <i className="bi bi-search"></i></label>
         

            <input
              ref={buscadorRef}
              type="text"
              id="buscarSelect"
              className="form-control"
              defaultValue={searchParams.get("filtro")}
              placeholder="Ej: Arroz Miraflores"
              onChange={(e) => debounceFiltrarPorNombre(e.target.value)}
            />
            <label htmlFor="orden">Orden:</label>

            {!searchParams.get("orden") && (
              <i className="bi bi-arrow-down-up"></i>
            )}
            {ordenPorProductosVenta.map((option) => {
              const ordenActual = searchParams.get("orden") ?? "";
              if (option.value === ordenActual) {
                return <i className={option.classIcon} />;
              }
            })}
            <select
              id="orden"
              name="orden"
              className="form-select w-auto"
              onChange={(e) => handleOrdenarChange(e.target.value)}
              defaultValue={searchParams.get("orden")}
            >
              <option value="">Ninguno</option>
              {ordenPorProductosVenta.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pb-1 d-flex gap-1 contenedor-secciones">
          <button
            onClick={filtrarPorSeccion}
            className={`border rounded btn-seleccion ${productos?.length === parseInt(searchParams.get("page_size")) ? "btn-filtro" : ""}`}
          >
            Todos
          </button>
          <SeccionButton
            filtrarPorSeccion={filtrarPorSeccion}
            productos={productos}
            productosPorPagina={parseInt(searchParams.get("page_size"))}
          />
        </div>
        {/* se agrega un la referencia para obtener el ancho y alto del contenedor de los productos apenas se renderice el componente (para evitar errores de calculo) */}
        <section className="container-productos" ref={componentProductosRef}>
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
    </>
  );
};
