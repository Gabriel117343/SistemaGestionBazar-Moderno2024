import React, { useContext, useEffect, useState } from "react";
import { ValidarProductos } from "./TablaProductos";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { ProductosContext } from "../../../context/ProductosContext";
import "./styles.css";
import { Modal } from "react-bootstrap";
import { FormEdicion } from "./FormEdicion";
import { FormRegistroProductos } from "./FormRegistroProductos";
import { debounce } from "lodash";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
// Para la UI
import CargaDeDatos from "../../../views/CargaDeDatos";
import { ButtonNew } from "../../shared/ButtonNew";
export const TablaProductosContenedor = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const [productoBuscado, setProductoBuscado] = useState(null); // Nuevo estado para el input de busqueda
  const {
    stateProducto: { productos, productoSeleccionado },
    eliminarProductoContext,
    getProductoContext,
    getProductosContext,
  } = useContext(ProductosContext);
  const [isLoading, setIsLoading] = useState(true);
  const INCLUIR_INACTIVOS = true;
  useEffect(() => {
    toast.dismiss({ id: "toastId" });
    async function cargar() {
      toast.loading("Cargando productos...", { duration: 2000, id: "toastId"});
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message } = await getProductosContext(INCLUIR_INACTIVOS); // se ejecuta la funcion getProductos del contexto de los productos
      if (success) {
        setIsLoading(false);
        toast.success(message, { id:"toastId"});
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos", { id: "toastId" }
        );
      }
    }
    cargar();
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
         
            toast.success(message, { id: 'toastId' });
          } else {
            toast.error(message, { id: 'toastId' });
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
  };
  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
    setShowModal(false);
  };
  const cambiarFiltro = (event) => {
    setProductoBuscado(event.target.value); // se guarda el valor del input de busqueda en el estado productoBuscado
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300); // Debounce para retrazar la ejecucion de la funcion cambiarFiltro
  // Acciones extra
  const refrescarTabla = async () => {
    toast.loading("Refrescando", { id: "toastId" });
    const { success, message } = await getProductosContext(INCLUIR_INACTIVOS);
    if (success) {
      toast.dismiss({ id: "toastId" });
      toast.success("Tabla refrescada", { id: "toastId" });
    } else {
      toast.dismiss({ id: "toastId" });
      toast.error(message ?? "Error inesperado al refrescar la tabla", { id: "toastId" });
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
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
          <i className="bi bi-search"></i>
          <input
            className="form-control"
            type="text"
            placeholder="Buscar producto por nombre, precio, tipo, seccion, proveedor..."
            onChange={debounceCambiarFiltro}
          />
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={debounceRefrescarTabla}
          >
            <i className="bi bi-arrow-repeat"></i>
          </button>
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={imprimirTabla}
          >
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarProductos
          listaProductos={productos}
          borrarProducto={borrarProducto}
          edicionProducto={edicionProducto}
          filtro={productoBuscado}
          showModal={showModal}
        />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Editar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormEdicion
            producto={productoSeleccionado}
            cerrarModal={cerrarModal}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroProductos cerrarModal={cerrarModal} />
        </Modal.Body>
      </Modal>
    </section>
  );
};
