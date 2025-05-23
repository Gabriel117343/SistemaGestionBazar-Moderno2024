import { MagicMotion } from "react-magic-motion";
import { Modal, Button } from "react-bootstrap";
import { PedidosContext } from "../../../context/PedidosContext";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useState, useContext, forwardRef, useId } from "react";
import { PedidoDetalle } from "./PedidoDetalle";

import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { PaginationButton } from "../../shared/PaginationButton";
import useFiltroDatosMostrar from "../../../hooks/useFiltroDatosMostrar";
import { paginaStock } from '@constants/defaultParams.js';

const MostrarPedidos = forwardRef(
  ({ refrescar, listaPedidos, componentRef }, ref) => {
    const { recibirPedidoContext, eliminarPedidoContext } =
      useContext(PedidosContext);
    const [showModal, setShowModal] = useState(false); // estado para mostrar la modal
    const [currentPage, setCurrentPage] = useState(1); // estado para la pagina actual
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    const navigate = useNavigate();
    const handleShow = () => setShowModal(true); // funcion para mostrar la modal
    const handleClose = () => setShowModal(false); // funcion para cerrar la modal
    const seleccionarPedido = (pedido) => {
      setPedidoSeleccionado(pedido); // aqui se guardara el pedido seleccionado para que pueda mostrarse en la modal
      handleShow();
    };
    const tableId = useId(); // id para la tabla de pedidos
    const recibirPedido = async (pedido) => {
      if (pedido.estado === "recibido") {
        Swal.fire({
          title: "Pedido Recibido",
          text: "El pedido ya ha sido recibido",
          icon: "info",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6", //
        });
        return;
      }
      const aceptar = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Se recibira el pedido seleccionado, no se podra deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, recibir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (!aceptar.isConfirmed) return; // si no se confirma la accion se cancela la funcion
      // al recibir el pedido se aumenta el stock de los productos del pedido automaticamente desde el backend
      const { success, message } = await recibirPedidoContext(pedido.id);

      if (success) {
        Swal.fire({
          title: "Pedido Recibido",
          text: message,
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6", //
        }).finally(() => {
          refrescar(); // se refresca la tabla para mostrar el cambio

          // Se redirige a la pagina de stocks con el proveedor del pedido seleccionado
          setTimeout(() => {
            navigate(`/admin/stocks?page=${paginaStock.page}&page_size${paginaStock.page_size}&proveedor=${pedido.proveedor.id}`);
          }, 1000);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6", //
        });
      }
    };

    const eliminarPedido = (id) => {
      console.log(id);
      async function confirmar() {
        const aceptar = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Se eliminara el pedido seleccionado, no se podra deshacer esta acción",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6", //
          cancelButtonColor: "#d33",
        });
        if (aceptar.isConfirmed) {
          const toastId = toast.loading("Eliminando...", { id: "loading" });
          setTimeout(async () => {
            const { success, message } = await eliminarPedidoContext(id);
            toast.dismiss(toastId, { id: "loading" });
            if (success) {
              toast.success(message);
            } else {
              toast.error(message);
            }
          }, 500);
        }
      }
      confirmar();
    };

    // Se define la cantidad de usuarios a mostrar por pagina
    const cantidadPedidos = 10;
    const pedidosMostrar = useFiltroDatosMostrar({
      currentPage,
      datosPorPagina: cantidadPedidos,
      datos: listaPedidos.toReversed(),
    });
    return (
      <section ref={ref}>
        <table
          className="table table-striped table-hover"
          style={{ filter: showModal && "blur(0.7px)" }}
        >
          <thead>
            <tr>
              <th id={`${tableId}-numero`}>#</th>
              <th id={`${tableId}-fechaCreacion`}>Fecha Creacion</th>
              <th id={`${tableId}-codigo`}>Código</th>
              <th id={`${tableId}-proveedor`}>Proveedor</th>
              <th id={`${tableId}-productos`}>Productos</th>
              <th id={`${tableId}-estado`}>Estado</th>
              <th id={`${tableId}-opciones`}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <MagicMotion>
              {pedidosMostrar?.map((pedido, index) => {
                return (
                  <tr key={pedido.id}>
                    <td headers={`${tableId}-numero`}>
                      {(currentPage - 1) * cantidadPedidos + index + 1}
                    </td>
                    <td headers={`${tableId}-fechaCreacion`}>
                      {pedido?.fecha_pedido.slice(0, 10)}
                    </td>
                    <td eaders={`${tableId}-codigo`}>{pedido?.codigo}</td>
                    <td headers={`${tableId}-proveedor`}>
                      {pedido?.proveedor.nombre}
                    </td>
                    <td headers={`${tableId}-productos`}>
                      {pedido?.productos.length}
                    </td>
                    <td headers={`${tableId}-estado`}>
                      {pedido?.estado.toLowerCase() === "pendiente" && (
                        <p
                          style={{
                            borderRadius: "30px",
                            maxWidth: "80px",
                            maxHeight: "24px",
                          }}
                          className="p-1 m-0 text-white bg-primary d-flex align-items-center justify-content-center mt-1"
                        >
                          {pedido.estado}
                        </p>
                      )}
                      {pedido?.estado.toLowerCase() === "ordenado" && (
                        <p
                          style={{
                            borderRadius: "30px",
                            maxWidth: "80px",
                            maxHeight: "24px",
                          }}
                          className="p-1 m-0 text-white bg-info d-flex align-items-center justify-content-center mt-1"
                        >
                          {pedido.estado}
                        </p>
                      )}
                      {pedido?.estado.toLowerCase() === "enviado" && (
                        <p
                          style={{
                            borderRadius: "30px",
                            maxWidth: "80px",
                            maxHeight: "24px",
                          }}
                          className="p-1 m-0 text-white bg-warning d-flex align-items-center justify-content-center mt-1"
                        >
                          {pedido.estado}
                        </p>
                      )}
                      {pedido?.estado.toLowerCase() === "recibido" && (
                        <p
                          style={{
                            borderRadius: "30px",
                            maxWidth: "80px",
                            maxHeight: "24px",
                          }}
                          className="p-1 m-0 text-white bg-success d-flex align-items-center justify-content-center mt-1"
                        >
                          {pedido.estado}
                        </p>
                      )}
                      {pedido?.estado.toLowerCase() === "cancelado" && (
                        <p
                          style={{
                            borderRadius: "30px",
                            maxWidth: "80px",
                            maxHeight: "24px",
                          }}
                          className="p-1 m-0 text-white bg-danger d-flex align-items-center justify-content-center mt-1"
                        >
                          {pedido.estado}
                        </p>
                      )}
                    </td>
                    <td
                      className="d-flex gap-1"
                      headers={`${tableId}-opciones`}
                    >
                      <button
                        className="btn btn-dark"
                        onClick={() => recibirPedido(pedido)}
                      >
                        <i className="bi bi-boxes"></i> Recibir
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarPedido(pedido.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => seleccionarPedido(pedido)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </MagicMotion>
          </tbody>
        </table>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Detalle del pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {pedidoSeleccionado && (
              <PedidoDetalle pedido={pedidoSeleccionado} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button>Imprimir</Button>
            <ReactToPrint
              trigger={() => (
                <Button className="btn btn-primary" type="button">
                  Imprimi2r
                </Button>
              )}
              content={() => componentRef.current}
            />
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="pagination-buttons mb-3 mt-1 animacion-numeros d-flex gap-1">
          <PaginationButton
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalDatos={listaPedidos.length}
            cantidadPorPagina={cantidadPedidos}
          />
        </div>
      </section>
    );
  }
);
const SinPedidos = () => {
  return (
    <section>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha Creación</th>
            <th>Código</th>
            <th>Proveedor</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">No se han encontrado Pedidos</h5>
      </div>
    </section>
  );
};
// forwardRef es esencial para pasar referencias a componentes funcionales en React, en este caso se pasa la referencia de la tabla para poder imprimir, basicamente envuelve el componente
// no se puede desestructurar el ref, se debe pasar como parametro - tenemos 2 parametros, el primero es el props y el segundo es la referencia
export const ValidarPedidos = forwardRef(({ refrescar, pedidos }, ref) => {
  const validacion = pedidos.length > 0;
  // RENDERIZADO CONDICIONAL, la validacion es true o false
  return validacion ? (
    <MostrarPedidos refrescar={refrescar} listaPedidos={pedidos} ref={ref} />
  ) : (
    <SinPedidos />
  );
});
