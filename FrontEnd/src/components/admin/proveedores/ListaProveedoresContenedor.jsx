import { useContext, useState, useRef } from "react";
import swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { Modal } from "react-bootstrap";
import { FormRegistroProveedores } from "./FormRegistroProveedores";
import { ValidarProveedores } from "./TablaProveedores";

import CargaDeDatos from "../../../views/CargaDeDatos";
import "./styles.css";
import { FiltroProveedores } from "./FiltroProveedores";
// Para la UI
import { ButtonNew } from "../../shared/ButtonNew";
import { PaginacionProveedores } from "./PaginacionProveedores";

export const ListaProveedoresContenedor = () => {
  const {
    stateProveedor: { proveedores, cantidad, page, page_size },
    eliminarProveedor,
    getProveedoresContext,
  } = useContext(ProveedoresContext);

  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para la carga de la pagina

  const componentRef = useRef();

  const borrarProveedor = (id) => {
    async function confirmar() {
      const aceptar = await swal.fire({
        title: "¿Estás seguro?",
        text: "Al eliminar el Proveedor se eliminaran todos sus productos asociados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (aceptar.isConfirmed) {
        toast.loading("Eliminando...", { id: "loading" });
        setTimeout(async () => {
          const { success, message } = await eliminarProveedor(id);
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

  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
  };

  // La primera vez la funcion se ejecuta inmediatamente, luego se ejecuta cada 2 segundos

  return (
    <section className="pt-2">
      <div className="d-flex row mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <FiltroProveedores
          getProveedores={getProveedoresContext}
          setIsLoading={setIsLoading}
          componentRef={componentRef}
        />
      </div>

      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarProveedores
          ref={componentRef}
          listaProveedores={proveedores}
          borrarProovedor={borrarProveedor}
          currentPage={page}
          pageSize={page_size}
        />
      )}
      <PaginacionProveedores cantidad={cantidad} />
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroProveedores cerrarModal={cerrarModal} />
        </Modal.Body>
      </Modal>
    </section>
  );
};
