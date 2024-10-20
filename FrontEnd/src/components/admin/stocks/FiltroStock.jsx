import { useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import { toast } from "react-hot-toast";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";

import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { paginaStock } from "@constants/defaultParams";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { InputSearch } from "../../shared/InputSearch";

import { ordenPorStock } from "@constants/defaultOptionsFilter.js";

export const FiltroStock = ({
  getStock,
  proveedorId,
  setIsLoading,
  proveedores,
}) => {
  const { mandatorios, opcionales } = paginaStock;
  const {
    searchParams,
    obtenerParametros,
    actualizarParametros,
    limpiarParametros,
  } = useMagicSearchParams({ mandatory: mandatorios, optional: opcionales });

  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    async function cargarStock() {
      const parametrosConsulta = obtenerParametros();

      toast.loading("Cargando", { id: "loading" });
      const { success, message } = await getStock(parametrosConsulta);
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

  const filtrarPorProducto = (filtro) => {
    const nuevoFiltro = filtro.trim().toLowerCase();

    // en caso haya un filtro por proveedor, se mantiene de lo contrario se elimina

    actualizarParametros({ newParams: { page: 1, filtro: nuevoFiltro } });
  };
  const debounceFiltrarPorProducto = debounce(filtrarPorProducto, 400); // Debounce para retrazar la ejecucion de la funcion cambiarFiltro

  const filtrarPorProveedor = (idProveedor) => {
    inputRef.current.value = ""; // se limpia el input de busqueda
    const newFiltro = { page: 1, proveedor: idProveedor };
    actualizarParametros({
      newParams: newFiltro,
      keepParams: { filtro: false },
    });
  };

  const handleOrdenarChange = (selectedOption) => {
    const newFiltro = { page: 1, orden: selectedOption };

    inputRef.current.value = ""; // se limpia el input de busqueda
    actualizarParametros({
      newParams: newFiltro,
      keepParams: { filtro: false },
    });
  };

  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });

    const parametrosConsulta = obtenerParametros();
    const { success } = await getStock(parametrosConsulta);
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

  const { proveedor, filtro, orden } = obtenerParametros();

  return (
    <section className="d-flex row  mb-2">
      <div className="col-md-3 pe-4 d-flex align-items-center gap-2">
        <label htmlFor="proveedor">Proveedor</label>
        <select
          ref={selectRef}
          id="proveedor"
          className="form-select"
          onChange={(e) => filtrarPorProveedor(e.target.value)}
          value={proveedor ?? "all"}
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
        <label htmlFor="filtro" aria-label="Icono de lupa">
          <i className="bi bi-search pb-2 pe-1"></i>
        </label>
        <InputSearch
          ref={inputRef}
          id="filtro"
          placeholder="Buscar por código, nombre o proveedor"
          defaultValue={filtro ?? ""}
          onChange={(e) => debounceFiltrarPorProducto(e.target.value)}
        />

        <label htmlFor="orden">Orden:</label>

        {!orden && <i className="bi bi-arrow-down-up"></i>}
        {ordenPorStock.map((option) => {
          const ordenActual = orden ?? "all";
          if (option.value === ordenActual) {
            return <i key={option.value} className={option.classIcon} />;
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
          {ordenPorStock.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ButtonRefresh onClick={debounceRefrescarTabla} />
        <ButtonPrint onClick={imprimirTabla} />
      </div>
    </section>
  );
};
