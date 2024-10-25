import React, { useContext, useState } from "react";
import { ValidarUsuarios } from "./TablaUsuarios";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

import { UsuariosContext } from "../../../context/UsuariosContext";
import "./styles.css";
import { Modal } from "react-bootstrap";
import { FormularioEdicion } from "./FormularioEdicion";

import { FormRegistroUsuarios } from "./FormRegistroUsuarios";
import { FiltroUsuarios } from './FiltroUsuarios'
import { PaginacionUsuarios } from './PaginacionUsuarios'

/** Para la UI */
import { ButtonNew } from "../../shared/ButtonNew";
import CargaDeDatos from "../../../views/CargaDeDatos";

export const TablaUsuariosContenedor = () => {
  const {
    stateUsuario: { usuarios, cantidad, page, page_size },
    deleteUsuario,
    getUsuario,
    getUsuarios,
  } = useContext(UsuariosContext);

  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const borrarUsuario = (id) => {

    async function confirmar() {
      const aceptar = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
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
          const { success, message } = await deleteUsuario(id);
          if (success) {
            toast.success(message, { id: "loading" });
          } else {
            toast.error(message, { id: "loading", duration: 2000 });
          }
        }, 2000);
      }
    }
    confirmar();
  };

  const edicionUsuario = async (id) => {
    const usuario = await getUsuario(id);
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
    setShowModal(false); // Cerrar la modal de edicion
  };

  return (
    <section>
      <div className="d-flex row mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <FiltroUsuarios
          setIsLoading={setIsLoading}
          getUsuarios={getUsuarios}
         />
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarUsuarios
          listaUsuarios={usuarios}
          borrarUsuario={borrarUsuario}
          currentPage={page}
          pageSize={page_size}
          edicionUsuario={edicionUsuario}
          showModal={showModal}
        />
      )}
      <PaginacionUsuarios cantidad={cantidad} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioEdicion
            usuario={usuarioSeleccionado}
            cerrarModal={cerrarModal}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroUsuarios cerrarModal={cerrarModal} />
        </Modal.Body>
      </Modal>
    </section>
  );

};
