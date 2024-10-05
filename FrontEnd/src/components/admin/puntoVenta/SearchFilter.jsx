import React from "react";
import { InputSearch } from "../../shared/InputSearch";

const SearchFilter = ({
  buscadorRef,
  debounceFiltrarPorNombre,
  filtroActual,
}) => {
  // Nota: no se establece el filtro en el "value", ya que hay un debounce que se encarga de actualizar el filtro
  // y eso retrazaria la actualización del input mientras se escribe
  return (
    <div className="col-md-5 d-flex justify-content-center align-items-center gap-2 ">
      <label htmlFor="filtro">
        <i className="bi bi-search"></i>
      </label>

      <InputSearch
        ref={buscadorRef}
        id="filtro"
        defaultValue={filtroActual ?? ""}
        placeholder="Ej: Arroz Miraflores"
        onChange={(e) => debounceFiltrarPorNombre(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;
