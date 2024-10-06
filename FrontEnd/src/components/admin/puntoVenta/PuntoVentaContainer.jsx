// Import necessary modules and contexts
import { useEffect, useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";

import { ProductosContext } from "../../../context/ProductosContext";
import { SeccionesContext } from "../../../context/SeccionesContext";

import { FiltroProductos } from "./FiltroProductos";
import { ValidarProductos } from "./ListaProductos";
import { PaginacionProductos } from "./PaginacionProductos";

import CargaDeDatos from "../../../views/CargaDeDatos";
import "./puntoventa.css";


const TOTAL_SECTIONS_SHOW = {
  page: 1,
  page_size: 20,
};

export const PuntoVentaContainer = () => {
  const {
    stateProducto: { productos, cantidad, page, page_size }, getProductosContext
  } = useContext(ProductosContext);

  const {
    stateSeccion: { secciones },
    getSeccionesContext,
  } = useContext(SeccionesContext);

  const [isLoading, setIsLoading] = useState(true);
  const [modoTabla, setModoTabla] = useState(false);

  const componenteProductosRef = useRef(null);

  useEffect(() => {
    const cargarSecciones = async () => {
      const { success, message } =
        await getSeccionesContext(TOTAL_SECTIONS_SHOW);
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las secciones", { id: 'loading'}
        );
      }
    };
    cargarSecciones();
  }, []);

  // Acciones extras
  const cambiarModo = () => {
    setModoTabla((prev) => !prev);
  };

  return (
    <>
      <FiltroProductos
        secciones={secciones}
        setIsLoading={setIsLoading}
        componenteProductosRef={componenteProductosRef}
        getProductosContext={getProductosContext}
        productos={productos}
        cambiarModo={cambiarModo}
        modoTabla={modoTabla}
      />
      {/* añadir esta section asegura que al montar el componente siempre se tengan las dimensiones correspondientes a la lista de productos a través de la referncia */}
      <section className="container-productos" ref={componenteProductosRef}>
        {isLoading ? (
          <CargaDeDatos />
        ) : (
          <ValidarProductos productos={productos} modoTabla={modoTabla} paginaActual={page} tamanoPagina={page_size} />
        )}
        <PaginacionProductos cantidad={cantidad} />
      </section>
    </>
  );
};
