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
  
  const {stateSeccion: { secciones }, getSeccionesContext } = useContext(SeccionesContext);
  const { stateProducto: { productos }, getProductosContext } = useContext(ProductosContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [filtroPorSeccionActivo, setFiltroPorSeccionActivo] = useState(false);
  
  const tipoRef = useRef(null);
  const buscadorRef = useRef(null);
  const INCLUIR_INACTIVOS = false // no se incluyen los productos inactivos

  useEffect(() => {
    const cargarProductos = async () => {
      // en vez de útilzar una promesa, se utiliza async await para esperar la respuesta y obtener el mensaje (es más limpio, facil de entender y rapido)
      toast.loading("Cargando productos...", { id: "loading" });
      const { success, message } = await getProductosContext(INCLUIR_INACTIVOS);
      if (success) {
        toast.success(message ?? "Productos cargados", { id: "loading" });
        setIsLoading(false); // se desactiva el componente de carga
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos", { id: "loading" }
        );
      }
    };
    const cargarSecciones = async () => {
      const { success, message } = await getSeccionesContext();
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las secciones"
        );
      }
    };
    cargarProductos();
    cargarSecciones();
    
  }, []);

  const filtrarPorSeccion = (id) => {
    // se resetea el input de busqueda y el select de categoria
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
      // usar 2 set dentro de una función no renderiza el componente 2 veces gracias a la reconciliación de react
    setFiltroPorSeccionActivo(true);
    setProductosFiltrados(productosFiltrados);
  };
  
  
  const filtroNombre = (event) => {
    // se setea el select de categoria en all
    tipoRef.current.value = "all";
    const nombre = event.target.value.toLowerCase().trim();
    if (nombre.length === 0) return setProductosFiltrados(productos);
    const productosFilt = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(nombre)
    );
    setProductosFiltrados(productosFilt);
  };

  const filtroCategoria = (event) => {
    // se setea el input de busqueda en vacio
    buscadorRef.current.value = "";
    const categoria = event.target.value;
    if (categoria === "all") return setProductosFiltrados(productos);
    const productosFilt = productos.filter(
      (producto) => producto.categoria.nombre === categoria
    );
    setProductosFiltrados(productosFilt);
  };
  const resetearProductosFiltrados = () => {
    setProductosFiltrados(productos);
  };
  // Si hay un filtro activo se activa la busqueda activa para mostrar los productos filtrados
  const refrescarProductos = async () => {
    const { success, message } = await getProductosContext(INCLUIR_INACTIVOS);
    if (!success) {
      toast.error(
        message ?? "Ha ocurrido un error inesperado al cargar los productos"
      );
    } else {
      toast.success(message ?? "Productos actualizados correctamente");
    }
  }
  
  const debounceFiltroNombre = debounce(filtroNombre, 300); // se le pasa la funcion y el tiempo de espera
  // en caso haya un filtro activo se activa la busqueda activa
  const busquedaActiva =
    tipoRef?.current?.value !== "all" ||
    buscadorRef?.current?.value?.length > 0 || filtroPorSeccionActivo;
  console.log(productos)
  return (
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-6">
            <label htmlFor="tipoSelect">Filtrar por categoria</label>
            <select
              ref={tipoRef}
              className="form-control"
              name="categoria"
              id="tipoSelect"
              onChange={(e) => filtroCategoria(e)}
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
                onClick={() => filtrarPorSeccion(seccion.id)}
                className={`border rounded btn-seleccion ${(productosFiltrados !== productos && !!busquedaActiva)  && productosFiltrados?.some((producto) => producto?.seccion?.numero === seccion?.numero) ? "btn-filtro" : ""}`}
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
            productos={ busquedaActiva 
                ? productosFiltrados
                : productos
            }
          />
        )}
      </div>
    </>
  );
};
