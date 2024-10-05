import React from "react";

import { paginaPuntoVenta } from "@constants/defaultParams";
import { PaginationButton } from "../../shared/PaginationButton";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";

export const PaginacionProductos = ({ cantidad }) => {
  const { mandatorios, opcionales } = paginaPuntoVenta;
  const { obtenerParametros, actualizarParametros } = useMagicSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });
  const { page, page_size } = obtenerParametros();

  // se actualizan el parametro obligatorio page y no se omiten ningun parametro
  const cambiarPagina = ({ newPage }) => {
    actualizarParametros({ newParams: { page: newPage }, keepParams: {} });
  };

  return (
    <PaginationButton
      currentPage={page}
      cambiarPagina={cambiarPagina}
      totalDatos={cantidad}
      cantidadPorPagina={page_size}
    />
  );
};
