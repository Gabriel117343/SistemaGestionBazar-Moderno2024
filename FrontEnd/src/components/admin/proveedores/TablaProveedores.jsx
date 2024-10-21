import { useState, useContext, forwardRef } from "react";
import { MagicMotion } from "react-magic-motion";
import { FormEdicion } from "./FormEdicion";
import { Modal } from "react-bootstrap";

import { toast } from "react-hot-toast";
import "./styles.css";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import calcularContador from "@utils/calcularContador";
import { ProveedorItem } from "./ProveedorItem";

const MostrarTabla = forwardRef(
  ({ listaProveedores, borrarProovedor, currentPage, pageSize }, ref) => {
    const {
      stateProveedor: { proveedorSeleccionado },
      getProveedorContext,
    } = useContext(ProveedoresContext);
    const [showModal, setShowModal] = useState(false);

    const edicionProveedor = async (id) => {
      toast.loading("Cargando...", { id: "loading" });
      const { success, message } = await getProveedorContext(id);
      if (success) {
        toast.dismiss("loading");
        setShowModal(true);
      } else {
        toast.error(message ?? "Ha ocurrido un Error inesperado", {
          id: "loading",
        });
      }
    };
    const cerrarModal = () => {
      setShowModal(false);
    };

    return (
      <section ref={ref}>
        <table
          className="table table-striped table-hover mb-0"
          id="tabla-proveedores"
          style={{ filter: showModal && "blur(0.7px)" }}
        >
          <thead className="border-bottom">
            <tr>
              <th>#</th>
              <th>Fecha Creación</th>
              <th>Nombre</th>
              <th>Persona Contacto</th>
              <th>Telefono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th colSpan={2} className="text-center">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <MagicMotion>
              {listaProveedores.map((proveedor, index) => {
                const contador = calcularContador({
                  index,
                  pageSize,
                  currentPage
                });
                return (
                  <ProveedorItem
                    key={proveedor.id}
                    proveedor={proveedor}
                    contador={contador}
                    borrarProovedor={borrarProovedor}
                    edicionProveedor={edicionProveedor}
                  />
                );
              })}
            </MagicMotion>
          </tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton className="bg-info">
            <Modal.Title>Editar Proveedor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormEdicion
              cerrarModal={cerrarModal}
              proveedor={proveedorSeleccionado}
            />
          </Modal.Body>
        </Modal>
      </section>
    );
  }
);

const SinProveedores = () => {
  return (
    <section className="pb-5">
      <table className="table table-striped">
        <thead className="border-bottom ">
          <tr>
            <th>#</th>
            <th>Fecha Creación</th>
            <th>Nombre</th>
            <th>Persona Contacto</th>
            <th>Telefono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
      </table>

      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">
          No se han encontrado Proveedores Registrados
        </h5>
      </div>
    </section>
  );
};
export const ValidarProveedores = forwardRef(
  ({ listaProveedores, ...props }, ref) => {
    const validacion = listaProveedores.length > 0; // si listaProveedores es mayor a 0
    // si persona es igual a true o false
    // RENDERIZADO CONDICIONAL
    return validacion ? (
      <MostrarTabla listaProveedores={listaProveedores} {...props} ref={ref} />
    ) : (
      <SinProveedores />
    );
  }
);
