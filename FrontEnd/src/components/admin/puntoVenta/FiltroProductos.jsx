import "./puntoventa.css";
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";

import { ProductosContext } from "../../../context/ProductosContext";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { debounce } from "lodash";

import { ValidarProductos } from "./ListaProductos";
import { useSearchParams } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";

import useCalculoProductosMostrar from "../../../hooks/useCalculoProductosMostrar";
// import { withLoadingImage } from '../../../hocs/withLoadingImage'
import { CategoriaSelect } from "../../shared/CategoriaSelect";
import { SeccionButton } from "../../shared/SeccionButton";
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
      page: searchParams.get("page"),
      page_size: searchParams.get("page_size"),
      filtro: searchParams.get("filtro") ?? "",
      categoria: searchParams.get("categoria") ?? "",
      seccion: searchParams.get("seccion") ?? "",
      incluir_inactivos: searchParams.get("incluir_inactivos"),
     
    };
  };
 
  useEffect(() => {
    async function calcular () {
      const newPageSize = await calcularProductosMostrar(componentProductosRef, sidebar);
      setSearchParams({ page: 1,incluir_inactivos: false, page_size: newPageSize });
    }
    calcular()
  
  }, [sidebar]);

  console.log(searchParams.get("page_size"))
  useEffect(() => {
    const cargarProductos = async () => {
      const productosPorPagina = searchParams.get("page_size");
      console.log(productosPorPagina)


      const parametros = parametrosDeConsulta();
      console.log(parametros)
      const { success, message } = await getProductosContext({
        ...parametros,
      
      });
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
  }, [searchParams]); // si los productos cambian o cambia el fitro se vuelve a cargar los productos

  const filtrar = ({ idSeccion = "all", filtro, idCategoria = "all" }) => {
    const newParams = { page: 1, page_size: parseInt(searchParams.get("page_size")), incluir_inactivos: false }; // parametros que siempre se envian en la busqueda

    if (idSeccion !== "all") {
      console.log(idSeccion);
      newParams.seccion = idSeccion;
      categoriaRef.current.value = "all";
      buscadorRef.current.value = "";
    } else if (idCategoria !== "all") {
      console.log(idCategoria);
      newParams.categoria = idCategoria;
      buscadorRef.current.value = "";
    } else if (filtro?.trim().length > 0) {
      newParams.filtro = filtro;
      categoriaRef.current.value = "all";
    } else {
      return setSearchParams({ page: 1, page_size: parseInt(searchParams.get("page_size")),  incluir_inactivos: false }); // si no hay filtro se resetea la busqueda y se muestran todos los productos
    }

    setSearchParams(newParams);
  };
  const debounceFiltrar = debounce(filtrar, 400);

  const cambiarPagina = ({ newPage }) => {
    setSearchParams({ page: newPage, page_size: parseInt(searchParams.get("page_size")), incluir_inactivos: true });
  };
  console.log("first");
  return (
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-6">
            <label htmlFor="categoriaSelect">Filtrar por categoria</label>
            <CategoriaSelect ref={categoriaRef} filtroCategoria={filtrar} />
          </div>
          <div className="col-md-6">
            <label htmlFor="buscarSelect">Buscar</label>
            <input
              ref={buscadorRef}
              type="text"
              id="buscarSelect"
              className="form-control"
              placeholder="Ej: Arroz Miraflores"
              onChange={(e) => debounceFiltrar({ filtro: e.target.value })}
            />
          </div>
        </div>

        <div className="pb-1 d-flex gap-1 contenedor-secciones">
          <button
            onClick={filtrar}
            className={`border rounded btn-seleccion ${productos?.length === parseInt(searchParams.get("page_size")) ? "btn-filtro" : ""}`}
          >
            Todos
          </button>
          <SeccionButton
            filtrarPorSeccion={filtrar}
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
