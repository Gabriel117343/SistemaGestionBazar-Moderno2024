import { useEffect, useRef } from "react";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";
import { InputSearch } from "../../shared/InputSearch";

import ReactToPrint from "react-to-print";

import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";

import { toast } from "react-hot-toast";
import { debounce } from "es-toolkit";
import { paginaProveedores } from "@constants/defaultParams.js";
import { ordenPorProveedores } from "@constants/defaultOptionsFilter.js";
import handleBeforePrintTable from '@utils/handleBeforePrintTable.js';

export const FiltroProveedores = ({
  getProveedores,
  setIsLoading,
  componentRef,
}) => {
  const { mandatorios, opcionales } = paginaProveedores;

  const {
    searchParams,
    actualizarParametros,
    limpiarParametros,
    obtenerParametros,
  } = useMagicSearchParams({ mandatory: mandatorios, optional: opcionales });

  const inputFiltroRef = useRef(null); // Referencia al input de busqueda

  useEffect(() => {
    async function cargarProveedores() {
      toast.loading("Cargando...", { id: "loading" });
      
      const parametros = obtenerParametros();
      const { success, message } = await getProveedores(parametros); // se ejecuta la funcion getProveedores del contexto de los proveedores
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "loading" });
      } else {
        toast.error(
          message ??
            "Ha ocurrido un error inesperado al cargar los Proveedores",
          { id: "loading" }
        );
      }
    }
    cargarProveedores();
  }, [searchParams]);

  const cambiarFiltro = (filtro) => {
    const filtroLimpio = filtro.trim().toLowerCase();

    actualizarParametros({ newParams: { page: 1, filtro: filtroLimpio } });
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 400); // Debounce para que no se ejecute la funcion cada vez que se escribe una letra

  const handleOrdenarChange = (selectedOption) => {
    inputFiltroRef.current.value = "";
    const newSearch = { page: 1, orden: selectedOption };

    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    }); // no se desea mantener el filtro
  };

  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando...", { id: "toastId" });

    const parametros = obtenerParametros();
    const { success, message } = await getProveedores(parametros);
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada", { id: "toastId" });
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error(message ?? "error al refrescar la Tabla", {
        id: "toastId",
        duration: 2000,
      });
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);

  const { filtro, orden } = obtenerParametros();


  return (
    <div className="col-md-10 d-flex gap-2 align-items-center">
      <label htmlFor="filtro" aria-label="icono lupa">
        {" "}
        <i className="bi bi-search"></i>
      </label>

      <InputSearch
        ref={inputFiltroRef}
        id="filtro"
        // Nota: se usa defaultValue ya que el input no tiene que ser controlado porque utiliza un debounce
        defaultValue={filtro ?? ""}
        placeholder="Buscar por nombre, persona de contacto, telefono..."
        onChange={(e) => debounceCambiarFiltro(e.target.value)}
      />
      <label htmlFor="orden">Orden:</label>
      {!orden && <i className="bi bi-arrow-repeat"></i>}
      {ordenPorProveedores.map((option) => {
        const ordenActual = orden ?? "all";
        if (option.value === ordenActual) {
          return <i key={option.value} className={option.classIcon}></i>;
        }
      })}
      <select
        id="orden"
        name="orden"
        className="form-select w-auto"
        onChange={(e) => handleOrdenarChange(e.target.value)}
        value={orden ?? "all"}
      >
        <option value="all">Ninguno</option>
        {ordenPorProveedores.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ButtonRefresh onClick={debounceRefrescarTabla} />

      <ReactToPrint
        trigger={() => <ButtonPrint />}
        content={() => componentRef?.current}
        onAfterPrint={() => limpiarParametros()}
        documentTitle="Proveedores"
        onBeforeGetContent={() => handleBeforePrintTable(componentRef)}
      />
    </div>
  );
};
