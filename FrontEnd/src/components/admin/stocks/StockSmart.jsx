import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ValidarStocks } from "./TablaStocks";
import { StocksContext } from "../../../context/StocksContext";

import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { toast } from "react-hot-toast";
import CargaDeDatos from "../../../views/CargaDeDatos";

import { FiltroStock } from "./FiltroStock";
import { PaginacionStock } from "./PaginacionStock";

export const StockSmart = () => {
  const {
    getStocksContext,
    stateStock: { stocks, cantidad, page, page_size },
  } = useContext(StocksContext);
  const {
    getProveedoresContext,
    stateProveedor: { proveedores },
  } = useContext(ProveedoresContext);

  const [isLoading, setIsLoading] = useState(true);
  const { proveedorId } = useParams();
  const navigate = useNavigate(); // navegar entre rutas

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

  return (
    <>
      <FiltroStock
        proveedorId={proveedorId}
        getStock={getStocksContext}
        setIsLoading={setIsLoading}
        proveedores={proveedores}
      />
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarStocks
          listaStocks={stocks}
          proveedorId={proveedorId}
          currentPage={page}
          pageSize={page_size}
        />
      )}
      <PaginacionStock cantidad={cantidad} />
    </>
  );
};
