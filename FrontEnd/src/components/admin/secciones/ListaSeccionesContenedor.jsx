import { useContext, useState, useRef } from "react";
import { ValidarSecciones } from "./ListaSecciones";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

import { SeccionesContext } from "../../../context/SeccionesContext";
import "./secciones.css";
import { Modal } from "react-bootstrap";
import { FormEdicion } from "./FormEdicion";

import { FormRegistroSecciones } from "./FormRegistroSecciones";

import { ButtonNew } from "../../shared/ButtonNew";

import CargaDeDatos from "../../../views/CargaDeDatos";

import { PaginacionSecciones } from "./PaginacionSecciones";

import { FiltroSecciones } from "./FiltroSecciones";

export const ListaSeccionesContenedor = () => {
  const {
    stateSeccion: { secciones, cantidad, page, page_size, seccionSeleccionada },
    eliminarSeccionContext,
    getSeccionContext,
    getSeccionesContext,
    actualizarSeccionContext,
    crearSeccionContext,
  } = useContext(SeccionesContext);

  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const [isLoading, setIsLoading] = useState(true);

  const borrarSeccion = (id) => {
    async function confirmar() {
      const aceptar = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Se eliminaran todos los productos asociados a esta Seccion",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (aceptar.isConfirmed) {
        toast.loading("Eliminando...", { duration: 2000, id: "loading" });
        setTimeout(async () => {
          const { success, message } = await eliminarSeccionContext(id);
          if (success) {
            toast.success(message, { id: "loading" });
          } else {
            toast.error(
              message ??
                "Ha ocurrido un error inesperado al eliminar la Sección",
              { id: "loading" }
            );
          }
        }, 2000);
      }
    }
    confirmar();
  };
  const edicionSeccion = async (id) => {
    toast.loading("Editando...", { id: "loading" });
    const { success, message } = await getSeccionContext(id);
    if (success) {
      setShowModal(true);
      toast.dismiss("loading");
    } else {
      toast.error(message, { id: "loading", duration: 2000 });
    }
  };
  const cerrarModal = () => {
    setShowModal(false);
    setShowRegistroModal(false); // Cerrar la modal de registro
  };

  return (
    <section className="pt-2">
      <div className="d-flex row mb-2">
        <div className="col-md-2">
          {/* Es posible pasar un icono personalizado como children */}

          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nueva
          </ButtonNew>
        </div>

        <FiltroSecciones
          getSeccionesContext={getSeccionesContext}
          setIsLoading={setIsLoading}
        />
      </div>
      <section>
        {isLoading ? (
          <CargaDeDatos />
        ) : (
          <ValidarSecciones
            listaSecciones={secciones}
            borrarSeccion={borrarSeccion}
            edicionSeccion={edicionSeccion}
            showModal={showModal}
            currentPage={page}
            pageSize={parseInt(page_size)}
          />
        )}
        <PaginacionSecciones cantidad={cantidad} />
      </section>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Seccion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormEdicion
            cerrarModal={cerrarModal}
            seccion={seccionSeleccionada}
            actualizarSeccion={actualizarSeccionContext}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showRegistroModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Seccion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroSecciones
            cerrarModal={cerrarModal}
            crearSeccion={crearSeccionContext}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};
