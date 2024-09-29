import React from "react";
import { SeccionButton } from "../../shared/SeccionButton";

const SeccionFilter = ({ filtrarPorSeccion, productos, secciones, searchParams }) => {
  return (
    <div className="pb-1 d-flex gap-1 contenedor-secciones">
      <button
        onClick={filtrarPorSeccion}
        className={`btn-seleccion ${
          productos?.length === parseInt(searchParams.get("page_size"))
            ? "btn-filtro"
            : ""
        }`}
      >
        Todos
      </button>
      <SeccionButton
        filtrarPorSeccion={filtrarPorSeccion}
        productos={productos}
        secciones={secciones}
        productosPorPagina={parseInt(searchParams.get("page_size"))}
      />
    </div>
  );
};

export default SeccionFilter;