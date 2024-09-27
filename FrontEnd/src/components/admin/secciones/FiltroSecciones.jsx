import React from "react";
import { InputSearch } from "../../shared/InputSearch";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";
import { ordenPorSecciones } from "@constants/defaultOptionsFilter";

export const FiltroSecciones = ({
  searchParams,
  inputFiltroRef,
  cambiarOrden,
  filtrar,
}) => {
  return (
    <>
      <label htmlFor="filtro" aria-label="filtro">
        <i className="bi bi-search"></i>
      </label>

      <InputSearch
        ref={inputFiltroRef}
        id="filtro"
        defaultValue={searchParams.get("filtro") ?? ""}
        onChange={(e) => filtrar(e.target.value)}
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
        onChange={(e) => cambiarOrden(e.target.value)}
        defaultValue={searchParams.get("orden") ?? ""}
      >
        <option value="">Ninguno</option>
        {ordenPorSecciones.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};
