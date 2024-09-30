import React from 'react'
import { useSearchParams } from 'react-router-dom';
import { PaginationButton } from "../../shared/PaginationButton";
import { paginaSecciones } from '@constants/defaultParams';

export const PaginacionSecciones = ({ cantidad }) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const cambiarPagina = ({ newPage }) => {
    const filtroActivo = searchParams.get("filtro");
    const ordenActivo = searchParams.get("orden");
    const page_size = parseInt(searchParams.get("page_size"));
    // se mantienen los parametros de busqueda activos si es que hay alguno, sino se eliminan
    setSearchParams({
      page: newPage,
      page_size: page_size ?? paginaSecciones.page_size,
      // propagación condicional de objetos
      ...(filtroActivo && { filtro: filtroActivo }),
      ...(ordenActivo && { orden: ordenActivo }),
    });
  };
  return (
    <PaginationButton
      currentPage={searchParams.get("page") ?? paginaSecciones.page}
      cambiarPagina={cambiarPagina}
      totalDatos={cantidad}
      cantidadPorPagina={
        searchParams.get("page_size") ?? paginaSecciones.page_size
      }
    />
  )
}
