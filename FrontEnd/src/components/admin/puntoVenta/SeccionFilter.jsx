import React from "react";
import { SeccionButton } from "../../shared/SeccionButton";

const SeccionFilter = ({ filtrarPorSeccion, productos, secciones, pageSizeActual, resetearFiltro }) => {
  return (
    <div className="pb-1 d-flex gap-1 contenedor-secciones">
      <button
        onClick={() => resetearFiltro()}
        className={`btn-seleccion ${
          productos?.length === parseInt(pageSizeActual)
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
        productosPorPagina={parseInt(pageSizeActual)}
      />
    </div>
  );
};

export default SeccionFilter;