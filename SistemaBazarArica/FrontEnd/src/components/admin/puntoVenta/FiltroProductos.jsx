import "./puntoventa.css";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { SeccionesContext } from "../../../context/SeccionesContext";
import { ProductosContext } from "../../../context/ProductosContext";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { debounce, set } from "lodash";
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
  const [isLoading, setIsLoding] = useState(true);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  useEffect(() => {
    const cargarProductos = async () => {
      const { success, message } = await getProductosContext();
      if (success) {
        toast.success(message ?? "Productos cargados");
        setIsLoding(false);
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
    const productosFiltrados = productos.filter(
      (producto) => producto.seccion.id === id
    );

    setProductosFiltrados(productosFiltrados);
  };
  const filtroNombre = (event) => {
    const nombre = event.target.value;

    const productosFilt = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    setProductosFiltrados(productosFilt);
  };

  const filtroTipo = (event) => {
    const tipo = event.target.value;
    if (tipo === "all") {
      setProductosFiltrados(productos);
      return;
    }
    const productosFilt = productos.filter(
      (producto) => producto.tipo === tipo
    );
    setProductosFiltrados(productosFilt);
  };
  const resetearProductosFiltrados = () => {
    setProductosFiltrados(productos);
  };
  const debounceFiltroNombre = debounce(filtroNombre, 300); // se le pasa la funcion y el tiempo de espera
  return (
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-6">
            <label htmlFor="tipoSelect">Filtrar por tipo</label>
            <select
              className="form-control"
              name="tipo"
              id="tipoSelect"
              onChange={filtroTipo}
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
              type="text"
              id="buscarSelect"
              className="form-control"
              placeholder="Ej: Arroz Miraflores"
              onChange={debounceFiltroNombre}
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
                className={`border rounded btn-seleccion ${productosFiltrados.some((producto) => producto.seccion.numero === seccion.numero) ? "btn-filtro" : ""}`}
              >
                {seccion.nombre}
              </button>
            </div>
          ))}
        </div>
        {isLoading ? (
          <CargaDeDatos />
        ) : (
          <ValidarProductos productos={productosFiltrados?.length > 0 ? productosFiltrados : productos} />
        )}
      </div>
    </>
  );
};
