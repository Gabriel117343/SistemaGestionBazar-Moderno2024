import { useEffect, useContext } from "react";
import { SeccionesContext } from "../../context/SeccionesContext";
import { toast } from "react-hot-toast";
import "./shared.css"
export const SeccionButton = ({ filtrarPorSeccion, productos, productosPorPagina }) => {
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
  return (
    <>
      {secciones?.map((seccion) => (
        <div key={seccion.id} className="seccion">
          <button
            onClick={() => filtrarPorSeccion({ idSeccion: seccion.id })}
            className={`border rounded btn-seleccion ${productos.length !== productosPorPagina && productos?.some((producto) => producto?.seccion?.numero === seccion?.numero) ? "btn-filtro" : ""}`}
          >
            {seccion.nombre}
          </button>
        </div>
      ))}
    </>
  );
};
