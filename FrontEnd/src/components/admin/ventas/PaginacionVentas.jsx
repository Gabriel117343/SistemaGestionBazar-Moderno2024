import React from "react";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { PaginationButton } from "../../shared/PaginationButton";
import { paginaVentas } from "@constants/defaultParams";

export const PaginacionVentas = ({ cantidad }) => {
  const { mandatorios, opcionales } = paginaVentas;
  const { actualizarParametros, obtenerParametros } = useMagicSearchParams({
    mandatory: mandatorios,
    optional: opcionales,
  });

  const { page, page_size } = obtenerParametros();
  const cambiarPagina = ({ newPage }) => {
    actualizarParametros({ newParams: { page: newPage }, keepParams: {} }); // no se omitira ningún parametro
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
