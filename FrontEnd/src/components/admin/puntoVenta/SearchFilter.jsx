import React from "react";
import { InputSearch } from "../../shared/InputSearch";
import { ordenPorProductosVenta } from "@constants/defaultOptionsFilter";

const SearchFilter = ({ buscadorRef, debounceFiltrarPorNombre, handleOrdenarChange, searchParams }) => {
  return (
    <div className="col-md-9 d-flex justify-content-center align-items-center gap-2">
      <label htmlFor="filtro">
        <i className="bi bi-search"></i>
      </label>
      <InputSearch
        ref={buscadorRef}
        id="filtro"
        defaultValue={searchParams.get("filtro")}
        placeholder="Ej: Arroz Miraflores"
        onChange={e => debounceFiltrarPorNombre(e.target.value)}
      />
      <label htmlFor="orden">Orden:</label>

      {!searchParams.get("orden") && <i className="bi bi-arrow-down-up"></i>}
      {ordenPorProductosVenta.map((option) => {
        const ordenActual = searchParams.get("orden") ?? "";
        if (option.value === ordenActual) {
          return <i key={option.value} className={option.classIcon} />;
        }
        return null;
      })}
      <select
        id="orden"
        name="orden"
        className="form-select w-auto"
        onChange={(e) => handleOrdenarChange(e.target.value)}
        defaultValue={searchParams.get("orden")}
      >
        <option value="">Ninguno</option>
        {ordenPorProductosVenta.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;