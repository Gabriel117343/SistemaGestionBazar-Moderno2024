import { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductosContext } from "../../../context/ProductosContext";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { ValidarStocks } from "./TablaStocks";
import { toast } from "react-hot-toast";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { debounce } from "lodash";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
export const StockSmart = () => {
  const {
    stateProducto: { productos },
    getProductosContext,
  } = useContext(ProductosContext);
  const {
    stateProveedor: { proveedores },
    getProveedoresContext,
  } = useContext(ProveedoresContext);
  const [stockFiltrado, setStockFiltrado] = useState(productos); // Nuevo estado para el input de busqueda
  const [isLoading, setIsLoading] = useState(true);
  const { proveedorId } = useParams();
  const navigate = useNavigate(); // navegar entre rutas
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    async function cargarProductos() {
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      toast.loading("Cargando productos...", { id: "loading" });
      const { success, message } = await getProductosContext();
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos", { id: "loading", duration: 2000 }
        );
      } else {
        toast.success(message, { id: 'loading' });
        setIsLoading(false);
      }
    }
    async function cargarProveedores() {
      const { success, message } = await getProveedoresContext()
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los proveedores"
        ) 
      } else {
        // Si hay un proveedorId, actualiza el select y filtra los productos
        if (proveedorId) {
          selectRef.current.value = proveedorId; // Actualiza el valor del select
          filtrarPorProveedor(proveedorId); // Filtra los productos basado en el proveedorId
        }
      }
    }
    cargarProductos();
    cargarProveedores();
  }, []);

  useEffect(() => {
    if (proveedorId) {
      selectRef.current.value = proveedorId; // Actualiza el valor del select
      filtrarPorProveedor(proveedorId); // Filtra los productos basado en el proveedorId
    }
  }, [productos]); // Dependencia en productos

  const cambiarFiltroNombre = (textoFiltro) => {
    // filtrar por nombre, proveedor o codigo
    console.log(textoFiltro)
    if (textoFiltro.trim().length === 0) return setStockFiltrado(productos);
    selectRef.current.value = "all";
    let nuevoFiltro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) ||
        producto.proveedor.nombre
          .toLowerCase()
          .includes(textoFiltro.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(textoFiltro.toLowerCase())
      );
    });
    setStockFiltrado(nuevoFiltro);
    navigate("/admin/stocks");
  };

  const filtrarPorProveedor = (idProveedor) => {

    inputRef.current.value = "";
    if (idProveedor === "all") {
      setStockFiltrado(productos);
      navigate("/admin/stocks");
      return;
    } else {
      // Filtrar por proveedor
      console.log(productos)
      let nuevoFiltro = productos.filter((producto) => {
        return producto.proveedor.id === parseInt(idProveedor);
      });
      setStockFiltrado(nuevoFiltro);
      // Navegar a la ruta con el id del proveedor
      navigate(`/admin/stocks/${idProveedor}`);
    }
    
  };

  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });
    const { success } = await getProductosContext();
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error("error al refrescar la Tabla");
    }
  };
  // Este hook hará que la primera vez que se llame la función se ejecute inmediatamente, pero las siguientes veces se retrase 2 segundos
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };
  const debounceCambiarFiltroNombre = debounce(cambiarFiltroNombre, 300); // Debounce para retrazar la ejecucion de la funcion cambiarFiltro
  

  const filtroActivo =
    inputRef.current?.value != "" || selectRef.current?.value != "all";
  
  return (
    <section>
      <div className="d-flex align-items-center mb-2 column">
        <div className="col-md-3 pe-4">
          <label htmlFor="proveedor">Proveedor</label>
          <select
            ref={selectRef}
            id="proveedor"
            className="form-select"
            onChange={(e) => filtrarPorProveedor(e.target.value)}
          >
            <option value="all">Todos</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-9 d-flex align-items-end gap-1">
          <i className="bi bi-search pb-2 pe-1"></i>
          <div style={{width: '100%'}}>
            <label htmlFor="nombre">Buscar</label>
            <input
              ref={inputRef}
              id="nombre"
              className="form-control"
              type="text"
              placeholder="Buscar por nombre, proveedor o codigo"
              onChange={e => debounceCambiarFiltroNombre(e.target.value)}
            />
          </div>
          
          <button
            className="btn btn-outline-primary"
            onClick={debounceRefrescarTabla}
          >
            <i className="bi bi-arrow-repeat"></i>
          </button>
          <button className="btn btn-outline-primary" onClick={imprimirTabla}>
            <i className="bi bi-printer"></i>
          </button>
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarStocks proveedorId={proveedorId} listaStocks={filtroActivo ? stockFiltrado : productos} />
      )}
    </section>
  );
};
