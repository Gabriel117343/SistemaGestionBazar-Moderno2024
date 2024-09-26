import React from "react";
import CategoriaFilter from "./CategoriaFilter";
import SearchFilter from "./SearchFilter";
import SeccionFilter from "./SeccionFilter";
import OrdenProductos from './OrdenProductos'

export const FiltroProductos = ({
  buscadorRef,
  filtrarPorCategoria,
  debounceFiltrarPorNombre,
  handleOrdenarChange,
  searchParams,
  secciones,
  filtrarPorSeccion,
  cambiarModo,
  productos,
  modoTabla,
}) => {
  return (
    <>
      <div className="row pb-1">
        <CategoriaFilter
          filtrarPorCategoria={filtrarPorCategoria}
          searchParams={searchParams}
        />
        <SearchFilter
          buscadorRef={buscadorRef}
          debounceFiltrarPorNombre={debounceFiltrarPorNombre}
          handleOrdenarChange={handleOrdenarChange}
          searchParams={searchParams}
          cambiarModo={cambiarModo}
        />
        <OrdenProductos
          handleOrdenarChange={handleOrdenarChange}
          searchParams={searchParams}
          cambiarModo={cambiarModo}
          modoTabla={modoTabla}
        />

      </div>
      <SeccionFilter
        filtrarPorSeccion={filtrarPorSeccion}
        productos={productos}
        secciones={secciones}
        searchParams={searchParams}
      />
 
    </>
  );
};