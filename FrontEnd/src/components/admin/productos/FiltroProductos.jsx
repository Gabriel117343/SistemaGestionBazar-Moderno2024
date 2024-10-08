import React, { useRef, useEffect } from "react";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { debounce } from "es-toolkit";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";

import { InputSearch } from "../../shared/InputSearch";
import { ButtonRefresh, ButtonPrint } from "../../shared/ButtonSpecialAccion";
import { toast } from "react-hot-toast";

import { paginaProductos } from "@constants/defaultParams.js";
import { ordenPorProductos } from "@constants/defaultOptionsFilter.js";
export const FiltroProductos = ({ getProductos, setIsLoading }) => {
  const { mandatorios: mandatory, opcionales: optional } = paginaProductos;
  const {
    searchParams,
    actualizarParametros,
    limpiarParametros,
    obtenerParametros,
  } = useMagicSearchParams({ mandatory, optional });
  const inputRef = useRef(null);

  useEffect(() => {
    const parametros = obtenerParametros();

    async function cargarProductos() {
      toast.loading("Cargando productos...", { duration: 2000, id: "toastId" });
      const { success, message } = await getProductos(parametros); // se ejecuta la funcion getProductos del contexto de los productos
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "toastId" });
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos",
          { id: "toastId" }
        );
      }
    }

    cargarProductos();
  }, [searchParams]);

  const filtrarProductos = (filtro) => {
    const newFiltro = filtro.trim().toLowerCase();

    actualizarParametros({ newParams: { page: 1, filtro: newFiltro } });
  };
  const debounceFiltrarProductos = debounce(filtrarProductos, 400); // Debounce para retrazar la ejecucion de la funcion

  const handleOrdenarChange = (selectedOption) => {
    const newSearch = { page: 1, orden: selectedOption };

    inputRef.current.value = ""; // se limpia el input de busqueda
    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    });
  };

  const refrescarTabla = async () => {
    toast.loading("Refrescando", { id: "toastId" });

    const parametros = obtenerParametros();
    const { success, message } = await getProductos(parametros);
    if (success) {
      toast.dismiss({ id: "toastId" });
      toast.success("Tabla refrescada", { id: "toastId" });
    } else {
      toast.dismiss({ id: "toastId" });
      toast.error(message ?? "Error inesperado al refrescar la tabla", {
        id: "toastId",
      });
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);

  // Acciones extra
  const imprimirTabla = () => {
    print();
  };

  const { filtro, orden } = obtenerParametros({ convertir: true });
  return (
    <>
      <label htmlFor="filtro">
        {" "}
        <i className="bi bi-search"></i>
      </label>

      <InputSearch
        ref={inputRef}
        id="filtro"
        /** En caso de que se recargue la página se mantienen el filtro consistente con la url **/
        defaultValue={filtro}
        placeholder="Buscar productos por nombre o código"
        onChange={(e) => debounceFiltrarProductos(e.target.value)}
      />
      <label htmlFor="orden">Orden:</label>

      {!orden && <i className="bi bi-arrow-down-up"></i>}
      {ordenPorProductos.map((option, index) => {
        const ordenActual = orden ?? "";
        if (option.value === ordenActual) {
          return <i key={index} className={option.classIcon} />;
        }
      })}
      <select
        id="orden"
        name="orden"
        className="form-select w-auto"
        onChange={(e) => handleOrdenarChange(e.target.value)}
        defaultValue={orden}
      >
        <option value="">Ninguno</option>
        {ordenPorProductos.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ButtonRefresh onClick={debounceRefrescarTabla} />
      <ButtonPrint onClick={imprimirTabla} />
    </>
  );
};
