import React from "react";
import { CategoriaSelect } from "../../shared/CategoriaSelect";

const CategoriaFilter = ({ filtrarPorCategoria, searchParams }) => {
  return (
    <div className="col-md-3 d-flex justify-content-center align-items-center gap-2">
      <label htmlFor="categoriaSelect">Categoría </label>
      <CategoriaSelect
        parametroCategoria={searchParams.get("categoria") ?? 'all'}
        filtroCategoria={filtrarPorCategoria}
        id="categoriaSelect"
      />
    </div>
  );
};

export default CategoriaFilter;