import React from "react";
import { useSearchParams } from "react-router-dom";
import { paginaPuntoVenta } from "@constants/defaultParams";
import { PaginationButton } from "../../shared/PaginationButton";

export const PaginacionProductos = ({ cantidad }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaPuntoVenta.page,
      page_size: searchParams.get("page_size") ?? paginaPuntoVenta.page_size,
      filtro: searchParams.get("filtro") ?? "",
      categoria: searchParams.get("categoria") ?? "",
      seccion: searchParams.get("seccion") ?? "",
      incluir_inactivos:
        searchParams.get("incluir_inactivos") ??
        paginaPuntoVenta.incluir_inactivos,
      orden: searchParams.get("orden") ?? "",
    };
  };
  const cambiarPagina = ({ newPage }) => {
    const { page_size, incluir_inactivos, categoria, filtro, orden } =
      parametrosDeConsulta();

    setSearchParams({
      // ...searchParams,
      page: newPage,
      page_size: page_size,
      incluir_inactivos: incluir_inactivos,
      ...(categoria && { categoria: categoria }),
      ...(orden && { orden: orden }),
      ...(filtro && { filtro: filtro }),
    });
  };

  return (
    <PaginationButton
      currentPage={searchParams.get("page") ?? paginaPuntoVenta.page}
      cambiarPagina={cambiarPagina}
      totalDatos={cantidad}
      cantidadPorPagina={
        searchParams.get("page_size") ?? paginaPuntoVenta.page_size
      }
    />
  );
};
