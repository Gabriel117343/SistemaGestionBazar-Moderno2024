import React from "react";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { PaginationButton } from "../../shared/PaginationButton";
import { paginaUsuarios } from "@constants/defaultParams";

export const PaginacionUsuarios = ({ cantidad }) => {
  const { mandatorios, opcionales } = paginaUsuarios;
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
