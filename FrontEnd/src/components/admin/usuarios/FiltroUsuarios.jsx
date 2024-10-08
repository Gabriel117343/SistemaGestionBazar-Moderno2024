import React, { useRef, useEffect } from "react";
import { paginaUsuarios } from "@constants/defaultParams.js";
import { ordenPorUsuarios } from "@constants/defaultOptionsFilter.js";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { debounce } from "es-toolkit";

import { InputSearch } from "../../shared/InputSearch";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { toast } from "react-hot-toast";

export const FiltroUsuarios = ({ setIsLoading, getUsuarios }) => {
  const { mandatorios, opcionales } = paginaUsuarios;
  const {
    searchParams,
    actualizarParametros,
    limpiarParametros,
    obtenerParametros,
  } = useMagicSearchParams({ mandatory: mandatorios, optional: opcionales });

  const inputFiltroRef = useRef(null);

  useEffect(() => {
    toast.dismiss({ id: "toastId" });

    async function cargarUsuarios() {
      const parametros = obtenerParametros();

      toast.loading("Cargando Usuarios...", { id: "toastId" });
      const { success, message } = await getUsuarios(parametros);
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "toastId" });
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los Usuarios",
          { id: "toastId" }
        );
      }
    }
    cargarUsuarios();
  }, [searchParams]);

  const cambiarFiltro = (filtro) => {
    const newFiltro = filtro.trim().toLowerCase();
    actualizarParametros({ newParams: { filtro: newFiltro, page: 1 } });
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 400); // El usuario debe esperar 400ms para que se ejecute la función

  const handleOrdenarChange = (selectedOption) => {
    const newSearch = { page: 1, orden: selectedOption };
    inputFiltroRef.current.value = "";
    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    });
  };

  // Acciones
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });

    const parametros = obtenerParametros();
    const { success, message } = await getUsuarios(parametros);
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error(message ?? "error al refrescar la Tabla");
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };
  const { orden, filtro } = obtenerParametros({ convertir: true });
  return (
    <div className="col-md-10 d-flex align-items-center gap-2">
      <label htmlFor="filtro">
        <i className="bi bi-search"></i>
      </label>
      <InputSearch
        ref={inputFiltroRef}
        id="filtro"
        defaultValue={filtro}
        placeholder="Buscar por rut, nombre, apellido o correo."
        onChange={(e) => debounceCambiarFiltro(e.target.value)}
      />

      <label htmlFor="orden">Orden:</label>

      {!searchParams.get("orden") && <i className="bi bi-arrow-down-up"></i>}
      {ordenPorUsuarios.map((option) => {
        const ordenActual = orden ?? "";
        if (option.value === ordenActual) {
          return <i key={option.value} className={option.classIcon} />;
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
        {ordenPorUsuarios.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ButtonRefresh onClick={debounceRefrescarTabla} />
      <ButtonPrint onClick={imprimirTabla} />
    </div>
  );
};
