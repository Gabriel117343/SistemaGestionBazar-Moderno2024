import React, { useContext, useEffect, useState, useRef } from "react";
import { ValidarProductos } from "./TablaProductos";
import { ProductosContext } from "../../../context/ProductosContext";
import "./styles.css";

import { FormEdicion } from "./FormEdicion";
import { FormRegistroProductos } from "./FormRegistroProductos";

// Para la UI
import CargaDeDatos from "../../../views/CargaDeDatos";
import { ButtonNew } from "../../shared/ButtonNew";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { Modal } from "react-bootstrap";

import useCategoriaStore from "../../../context/store/categoriaStore";
("../../../context/store/categoriaStore");

import CustomModal from "../../../views/CustomModal";
import { FiltroProductos } from "./FiltroProductos";
import { PaginacionProductos } from "./PaginacionProductos";

export const ProductosContenedor = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const {
    stateProducto: {
      productos,
      cantidad,
      productoSeleccionado,
      page,
      page_size,
    },
    eliminarProductoContext,
    getProductoContext,
    getProductosContext,
  } = useContext(ProductosContext);
  const { categorias, geAllCategoriasStore } = useCategoriaStore(); // se obtienen las categorias del store

  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef(null); // Referencia para el modal

  useEffect(() => {
    // se ejecuta la funcion cargarCategorias al montar el componente
    async function cargarCategorias() {
      const { success, message } = await geAllCategoriasStore();
      if (!success) {
        toast.error(message ?? "Error inesperado al cargar las categorias");
      }
    }
    cargarCategorias();
  }, []);
  const borrarProducto = (id) => {
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
        toast.loading("Eliminando...", { id: "toastId" });
        setTimeout(async () => {
          const { success, message } = await eliminarProductoContext(id);
          if (success) {
            toast.success(message, { id: "toastId" });
          } else {
            toast.error(message, { id: "toastId" });
          }
        }, 1000);
      }
    }
    confirmar();
  };
  const edicionProducto = async (id) => {
    const { success, message } = await getProductoContext(id);
    if (success) {
      setShowModal(true);
    } else {
      toast.error(message);
    }
    setShowModal(!showModal);
  };

  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
    setShowModal(false);
  };

  return (
    <section className="pt-2">
      <div className="row d-flex mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <div className="col-md-10 d-flex align-items-center gap-2">
          <FiltroProductos
            setIsLoading={setIsLoading}
            getProductos={getProductosContext}
          />
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarProductos
          listaProductos={productos}
          borrarProducto={borrarProducto}
          edicionProducto={edicionProducto}
          currentPage={page}
          showModal={showModal}
          // asi se obtiene el valor de un parametro de busqueda para que se mantenga consistente con la url
          pageSize={page_size}
        />
      )}
      <PaginacionProductos cantidad={cantidad} />

      <CustomModal
        ref={modalRef}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <CustomModal.Header>
          <h2>Título del Modal</h2>
        </CustomModal.Header>
        <CustomModal.Body>
          <FormEdicion
            producto={productoSeleccionado}
            cerrarModal={cerrarModal}
            categorias={categorias}
          />
        </CustomModal.Body>
      </CustomModal>
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroProductos
            cerrarModal={cerrarModal}
            categorias={categorias}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};
