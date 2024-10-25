import React from "react";

import { PaginationButton } from "../../../shared/PaginationButton";


export const PaginacionVendedores = ({ page, cambiarPagina, cantidad, pageSize }) => {


  return (
    <PaginationButton
      currentPage={page}
      cambiarPagina={cambiarPagina}
      totalDatos={cantidad}
      cantidadPorPagina={pageSize}
    />
  );
};
