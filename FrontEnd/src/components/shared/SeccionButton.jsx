import { useEffect, useContext, useMemo } from "react";
import { SeccionesContext } from "../../context/SeccionesContext";
import { toast } from "react-hot-toast";
import "./shared.css";
export const SeccionButton = ({
  filtrarPorSeccion,
  productos,
  productosPorPagina,
}) => {
  const {
    stateSeccion: { secciones },
    getSeccionesContext,
  } = useContext(SeccionesContext);

  useEffect(() => {
    const cargarSecciones = async () => {
      const { success, message } = await getSeccionesContext();
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las secciones"
        );
      }
    };
    cargarSecciones();
  }, []);

  // memoizar la función para evitar que se ejecute en cada renderizado


  const verificarCoincidencia = (numero) => {
    if (productos.length !== productosPorPagina) {
      const newClase = productos?.some(
        (producto) => producto?.seccion?.numero === numero
      )
        ? "btn-filtro"
        : "";

      return newClase;
    }
    return "";
  };
  return (
    <>
      {secciones?.map((seccion) => (
        <div key={seccion.id} className="seccion">
          <button
            onClick={() => filtrarPorSeccion({ idSeccion: seccion.id })}
            className={`border rounded btn-seleccion ${verificarCoincidencia(seccion.numero)}`}
          >
            {seccion.nombre}
          </button>
        </div>
      ))}
    </>
  );
};
