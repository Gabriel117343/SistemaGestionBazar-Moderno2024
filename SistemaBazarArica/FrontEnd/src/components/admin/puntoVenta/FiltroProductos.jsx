import "./puntoventa.css";
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import { SeccionesContext } from "../../../context/SeccionesContext";
import { ProductosContext } from "../../../context/ProductosContext";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { debounce } from "lodash";
import { ValidarProductos } from "./ListaProductos";
// import { withLoadingImage } from '../../../hocs/withLoadingImage'
export const FiltroProductos = () => {
  const {
    stateSeccion: { secciones },
    getSeccionesContext,
  } = useContext(SeccionesContext);
  const {
    stateProducto: { productos },
    getProductosContext,
  } = useContext(ProductosContext);
  const [isLoading, setIsLoading] = useState(true);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);

  const tipoRef = useRef(null);
  const buscadorRef = useRef(null);
  const seccionRef = useRef(null);

  useEffect(() => {
    const cargarProductos = async () => {
      const { success, message } = await getProductosContext();
      if (success) {
        toast.success(message ?? "Productos cargados");
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos"
        );
      }
    };
    const cargarSecciones = async () => {
      const { success, message } = await getSeccionesContext();
      if (!success) {
        toast.error(message ?? "Error al cargar las secciones");
      }
    };
    cargarProductos();
    cargarSecciones();
  }, []);
  const filtrarPorSeccion = (id) => {
    // se resetea el input de busqueda y el select de tipo
    toast.dismiss({ id: "loading" }); // se cierra el toast de cargando
    buscadorRef.current.value = "";
    tipoRef.current.value = "all";
    const productosFiltrados = productos.filter(
      (producto) => producto.seccion.id === id
    );
    if (productosFiltrados.length === 0)
      return toast.error("No hay productos en esta seccion", {
        id: "loading",
        duration: 1500,
      });

    setProductosFiltrados(productosFiltrados);
  };
  const filtroNombre = (event) => {
    // se setea el select de tipo en all
    tipoRef.current.value = "all";
    const nombre = event.target.value.toLowerCase().trim();
    if (nombre.length === 0) return setProductosFiltrados(productos);
    const productosFilt = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(nombre)
    );
    setProductosFiltrados(productosFilt);
  };

  const filtroTipo = (event) => {
    // se setea el input de busqueda en vacio
    buscadorRef.current.value = "";
    const tipo = event.target.value;

    const productosFilt = productos.filter(
      (producto) => producto.tipo === tipo
    );
    setProductosFiltrados(productosFilt);
  };
  const resetearProductosFiltrados = () => {
    setProductosFiltrados(productos);
  };
  // Si hay un filtro activo se activa la busqueda activa para mostrar los productos filtrados
  const busquedaActiva =
    tipoRef?.current?.value !== "all" ||
    buscadorRef?.current?.value?.length > 0;
  const debounceFiltroNombre = debounce(filtroNombre, 300); // se le pasa la funcion y el tiempo de espera
  return (
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-6">
            <label htmlFor="tipoSelect">Filtrar por tipo</label>
            <select
              ref={tipoRef}
              className="form-control"
              name="tipo"
              id="tipoSelect"
              onChange={(e) => filtroTipo(e)}
              defaultValue="all"
            >
              <option value="all">Todas</option>
              <option value="bebidas">Bebidas</option>
              <option value="carnes">Carnes</option>
              <option value="lacteos">Lacteos</option>
              <option value="pastas">Pastas</option>
              <option value="snacks">Snacks</option>
              <option value="aseo">Aseo</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="buscarSelect">Buscar</label>
            <input
              ref={buscadorRef}
              type="text"
              id="buscarSelect"
              className="form-control"
              placeholder="Ej: Arroz Miraflores"
              onChange={(e) => debounceFiltroNombre(e)}
            />
          </div>
        </div>

        <div className="pb-1 d-flex gap-1 contenedor-secciones">
          <button
            onClick={() => resetearProductosFiltrados(productos)}
            className={`border rounded btn-seleccion ${productosFiltrados.length === productos.length ? "btn-filtro" : ""}`}
          >
            Todos
          </button>

          {secciones?.map((seccion) => (
            <div key={seccion.id} className="seccion">
              <button
                ref={seccionRef}
                onClick={() => filtrarPorSeccion(seccion.id)}
                className={`border rounded btn-seleccion ${productosFiltrados?.some((producto) => producto?.seccion?.numero === seccion?.numero) ? "btn-filtro" : ""}`}
              >
                {seccion.nombre}
              </button>
            </div>
          ))}
        </div>
        {isLoading ? (
          <CargaDeDatos />
        ) : (
          <ValidarProductos
            productos={
              productosFiltrados?.length > 0 || busquedaActiva
                ? productosFiltrados
                : productos
            }
          />
        )}
      </div>
    </>
  );
};
