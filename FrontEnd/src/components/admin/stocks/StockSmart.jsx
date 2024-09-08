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

export const StockSmart = () => {
  const { getStocksContext, stocks, cantidad } = useContext(StocksContext);
  const { getProveedoresContext, proveedores } = useContext(ProveedoresContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const { proveedorId } = useParams();
  const navigate = useNavigate(); // navegar entre rutas
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? 1,
      page_size: searchParams.get("page_size") ?? 10,
      proveedorId: searchParams.get("proveedor") ?? "",
      filtro: searchParams.get("filtro") ?? "",
    };
  };

  useEffect(() => {
    async function cargarProveedores() {
      const parametrosConsulta = parametrosDeConsulta();
      const { success, message } =
        await getProveedoresContext(parametrosConsulta);
      if (!success) {
        setIsLoading(false);
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los proveedores"
        );
      } else {
        // Si hay un proveedorId, actualiza el select y filtra los productos
        if (proveedorId) {
          selectRef.current.value = proveedorId; // Actualiza el valor del select
          filtrarPorProveedor(proveedorId); // Filtra los productos basado en el proveedorId
        }
      }
    }

    cargarProveedores();
  }, []);

  // useEffect(() => {
  //   if (proveedorId) {
  //     selectRef.current.value = proveedorId; // Actualiza el valor del select
  //     filtrarPorProveedor(proveedorId); // Filtra los productos basado en el proveedorId
  //   }
  // }, [productos]); // Dependencia en productos

  const filtrarPorProducto = (filtro) => {
    // filtrar por nombre, proveedor o codigo

    const nuevoFiltro = filtro.trim();
    if (nuevoFiltro.length === 0) {
      setSearchParams({
        page: 1,
        page_size: parseInt(searchParams.get("page_size")),
      });
      return;
    }

    setSearchParams({ page: 1, filtro: nuevoFiltro });
    navigate("/admin/stocks");
  };

  const filtrarPorProveedor = (idProveedor) => {
    setSearchParams({ page: 1, proveedor: idProveedor });
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
            {proveedores?.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-9 d-flex align-items-end gap-1">
          <i className="bi bi-search pb-2 pe-1"></i>
          <div style={{ width: "100%" }}>
            <label htmlFor="nombre">Buscar</label>
            <input
              ref={inputRef}
              id="nombre"
              className="form-control"
              type="text"
              placeholder="Buscar por nombre, proveedor o codigo"
              onChange={(e) => debounceFiltrarPorProducto(e.target.value)}
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
        <ValidarStocks proveedorId={proveedorId} listaStocks={stocks} />
      )}
    </section>
  );
};
