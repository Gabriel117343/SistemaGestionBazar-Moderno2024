import { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ValidarStocks } from "./TablaStocks";
import { StocksContext } from "../../../context/StocksContext";

import { useSearchParams } from "react-router-dom";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { toast } from "react-hot-toast";
import CargaDeDatos from "../../../views/CargaDeDatos";

import { debounce } from "lodash";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { paginaStock } from "@constants/defaultParams.js";
import { ordenPorStock } from "@constants/defaultOptionsFilter";
export const StockSmart = () => {
  const {
    getStocksContext,
    stateStock: { stocks, cantidad },
  } = useContext(StocksContext);
  const {
    getProveedoresContext,
    stateProveedor: { proveedores },
  } = useContext(ProveedoresContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const { proveedorId } = useParams();
  const navigate = useNavigate(); // navegar entre rutas
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaStock.page,
      page_size: searchParams.get("page_size") ?? paginaStock.page_size,
      proveedorId: searchParams.get("proveedor") || proveedorId || "",
      filtro: searchParams.get("filtro") ?? "",
      proveedor: searchParams.get("proveedor") ?? "",
      orden: searchParams.get("orden") ?? "",
    };
  };

  useEffect(() => {
    async function cargarStock() {
      const parametrosConsulta = parametrosDeConsulta();

      toast.loading("Cargando", { id: "loading" });
      const { success, message } = await getStocksContext(parametrosConsulta);
      if (success) {
        setIsLoading(false);
        toast.success(message ?? "Stocks cargados correctamente", {
          id: "loading",
        });
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los stocks",
          { id: "loading" }
        );
      }
    }
    cargarStock();
  }, [searchParams, proveedorId]); // en caso se reciba un parametro de proveedorId se ejecuta el useEffect

  useEffect(() => {
    async function cargarProveedores() {
      const { success, message } = await getProveedoresContext();
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los proveedores"
        );
      }
    }

    cargarProveedores();
  }, []);

  const filtrarPorProducto = (filtro) => {
    const nuevoFiltro = filtro.trim().toLowerCase();

    // en caso haya un filtro por proveedor, se mantiene de lo contrario se elimina
    const { page_size, proveedor, orden } = parametrosDeConsulta();

    // en todo filtro se debe reiniciar la pagina a 1
    setSearchParams({
      page: 1,
      page_size: page_size,
      ...(proveedor && { proveedor: proveedor }),
      ...(orden && { orden: orden }),
      ...(nuevoFiltro && { filtro: nuevoFiltro }),
    });
  };

  const filtrarPorProveedor = (idProveedor) => {
    // en caso haya un filtro activo, se mantiene de lo contrario se elimina

    const { page_size, orden } = parametrosDeConsulta();
    inputRef.current.value = ""; // se limpia el input de busqueda
    setSearchParams({
      page: 1,
      page_size: page_size,
      ...(idProveedor !== "all" ? { proveedor: idProveedor } : {}), // si el proveedor es all, se elimina del objeto de busqueda sino se agrega
      ...(orden && { orden: orden }),
    });
  };

  const cambiarPagina = ({ newPage }) => {
    // en caso haya un filtro por proveedor, se mantiene de lo contrario se elimina
    const { page_size, proveedor, orden, filtro } = parametrosDeConsulta();
    setSearchParams({
      page: newPage,
      page_size: page_size,
      ...(proveedor && { proveedor: proveedor }),

      ...(orden && { orden: orden }),
      ...(filtro && { filtro: filtro }),
    });
  };

  const handleOrdenarChange = (selectedOption) => {
    const { page_size, proveedor } = parametrosDeConsulta();

    inputRef.current.value = ""; // se limpia el input de busqueda
    setSearchParams({
      page: 1,
      page_size: page_size,
      ...(proveedor && { proveedor: proveedor }),
      ...(selectedOption && { orden: selectedOption }),

    });
  };

  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });

    const parametrosConsulta = parametrosDeConsulta();
    const { success } = await getStocksContext(parametrosConsulta);
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
  const debounceFiltrarPorProducto = debounce(filtrarPorProducto, 400); // Debounce para retrazar la ejecucion de la funcion cambiarFiltro

  return (
    <section>
      <div className="d-flex row  mb-2">
        <div className="col-md-3 pe-4 d-flex align-items-center gap-2">
          <label htmlFor="proveedor">Proveedor</label>
          <select
            ref={selectRef}
            id="proveedor"
            className="form-select"
            onChange={(e) => filtrarPorProveedor(e.target.value)}
            value={proveedorId ?? searchParams.get("proveedor")}
          >
            <option value="all">Todos</option>
            {proveedores?.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-9 d-flex align-items-center gap-2">
          <label htmlFor="nombre">
            <i className="bi bi-search pb-2 pe-1"></i>
          </label>
          <input
            ref={inputRef}
            id="nombre"
            className="form-control"
            type="text"
            placeholder="Buscar por código, nombre o proveedor"
            defaultValue={searchParams.get("filtro")}
            onChange={(e) => debounceFiltrarPorProducto(e.target.value)}
          />
          <label htmlFor="orden">Orden:</label>

          {!searchParams.get("orden") && (
            <i className="bi bi-arrow-down-up"></i>
          )}
          {ordenPorStock.map((option) => {
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
            {ordenPorStock.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

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
        <ValidarStocks
          listaStocks={stocks}
          proveedorId={
            proveedorId ??
            parseInt(
              !searchParams.get("filtro") && searchParams.get("proveedor")
            )
          }
          currentPage={searchParams.get("page") || 1}
          cambiarPagina={cambiarPagina}
          cantidadDatos={cantidad}
          pageSize={searchParams.get("page_size")}
        />
      )}
    </section>
  );
};
