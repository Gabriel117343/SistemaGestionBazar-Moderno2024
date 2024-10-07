import React, { useEffect, useRef } from "react";
import { InputSearch } from "../../shared/InputSearch";
import { ordenPorSecciones } from "@constants/defaultOptionsFilter";
import { paginaSecciones } from "@constants/defaultParams";

import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";

import { debounce } from "es-toolkit";

import { toast } from "react-hot-toast";
import { useMagicSearchParams } from '../../../hooks/useMagicSearchParams'

export const FiltroSecciones = ({ getSeccionesContext, setIsLoading }) => {
  
  const { mandatorios, opcionales } = paginaSecciones;
  const { searchParams, obtenerParametros, actualizarParametros, limpiarParametros } = useMagicSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });

  const inputFiltroRef = useRef(null); // Referencia al input de busqueda


  useEffect(() => {
    async function cargar() {
      toast.loading("Cargando...", { duration: 2000, id: "loading" });
     
      const parametros = obtenerParametros();
      const { success, message } = await getSeccionesContext(parametros); // se ejecuta la funcion getProductos del contexto de los productos
    
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "loading" });
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las Secciones",
          { duration: 2000, id: "loading" }
        );
      }
    }
    cargar();
  }, [searchParams]);

  const filtrarPorNombre = (filtro) => {
    const filtroLimpio = filtro.trim();
    actualizarParametros({ newParams: { page: 1, filtro: filtroLimpio } });
  };
  const debounceFiltrarPorNombre = debounce(filtrarPorNombre, 400); // retrasa la ejucion de la funcion cambiar filtro por 300 milisegundos

  const handleOrdenarChange = (selectedOption) => {
    inputFiltroRef.current.value = "";
    const newSearch = { page: 1, orden: selectedOption };

    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    })
  };

  // ACCIONES EXTRA ------------------
  const refrescarTabla = async () => {
    toast.loading("Actualizando tabla...", { id: "loading" });

    const parametros = obtenerParametros();
    const { success } = await getSeccionesContext(parametros);

    if (success) {
      toast.success("Tabla actualizada", { id: "loading" });
    } else {
      toast.error("Error al actualizar la tabla", { id: "loading" });
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };

  return (
    <section className="col-md-10 d-flex align-items-center gap-2">
      <label htmlFor="filtro" aria-label="filtro">
        <i className="bi bi-search"></i>
      </label>

      <InputSearch
        ref={inputFiltroRef}
        id="filtro"
        // Nota: se usa defaultValue ya que el input no tiene que ser controlado poque utiliza un debounce
        defaultValue={searchParams.get("filtro") ?? ""}
        onChange={(e) => debounceFiltrarPorNombre(e.target.value)}
        placeholder="Buscar por nombre o por número"
      />
      <label htmlFor="orden" aria-label="orden">
        Orden:
      </label>
      {!searchParams.get("orden") && <i className="bi-bi-arrow-down-up"></i>}
      {ordenPorSecciones.map((option) => {
        const ordenActual = searchParams.get("orden") ?? "";
        if (option.value === ordenActual) {
          return <i className={option.classIcon}></i>;
        }
      })}
      <select
        id="orden"
        name="orden"
        className="form-select w-auto"
        onChange={(e) => handleOrdenarChange(e.target.value)}
        value={searchParams.get("orden") ?? ""}
      >
        <option value="">Ninguno</option>
        {ordenPorSecciones.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ButtonRefresh onClick={debounceRefrescarTabla} />
      <ButtonPrint onClick={imprimirTabla} />
    </section>
  );
};
