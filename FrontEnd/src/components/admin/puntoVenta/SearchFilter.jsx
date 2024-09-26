import React from "react";
import { InputSearch } from "../../shared/InputSearch";

const SearchFilter = ({ buscadorRef, debounceFiltrarPorNombre, searchParams }) => {
  return (
    <div className="col-md-5 d-flex justify-content-center align-items-center gap-2 ">
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
    </div>
  );
};

export default SearchFilter;