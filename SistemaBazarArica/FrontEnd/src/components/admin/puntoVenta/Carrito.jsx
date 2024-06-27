import { useState, useEffect, useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { Modal } from "react-bootstrap";
import { FormRegistroCliente } from "./FormRegistroCliente";
import { ListaClientes } from "./ListaClientes";
import { ClientesContext } from "../../../context/ClientesContext";
import { CarritoContext } from "../../../context/CarritoContext";
import { ProductosContext } from "../../../context/ProductosContext";
import { VentasContext } from "../../../context/VentasContext";
import { toast } from "react-hot-toast";
import useCarrito from "../../../hooks/useCarrito";

import "./puntoVenta.css";
import { debounce } from "lodash";
import Swal from "sweetalert2";
export const Carrito = () => {
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [opcionCliente, setOpcionCliente] = useState(true);
  const { obtenerInfoVentaTipo, obtenerInfoVentaProducto } = useCarrito();
  const { createVentaContext } = useContext(VentasContext);
  const {
    stateCliente: { clientes, clienteSeleccionado },
    getClientesContext,
  } = useContext(ClientesContext);
  // Contexto de carrito
  const {
    carrito,
    agregarProductoCarrito,
    eliminarProductoCarrito,
    restarProductoCarrito,
    vaciarCarrito,
    actualizarCantidadCarrito,
  } = useContext(CarritoContext);
  const {
    stateProducto: { productos },
  } = useContext(ProductosContext);

  useEffect(() => {
    // si no hay productos en el carrito o no hay un cliente seleccionado, se habilita la opcion de seleccionar cliente
    if ((carrito.length === 0 && !opcionCliente) || !clienteSeleccionado) {
      setOpcionCliente(true);
    } else {
      setOpcionCliente(false);
    }
    // cuando cambie el cliente seleccionado, se habilita la opcion de seleccionar cliente
  }, [clienteSeleccionado]);
  useEffect(() => {
    const cargarClientes = async () => {
      const { success, message } = await getClientesContext();
      if (!success) {
        toast.error(message ?? "Error al cargar los clientes");
      }
    };
    cargarClientes();
  }, []);
  const ajustarOpciones = () => {
    setOpcionCliente(true);
  };
  const agregarProducto = async (producto) => {
    const { success, message } = await agregarProductoCarrito(producto);
    toast.dismiss({ id: "loading" }); // se cierra el toast de cargando
    if (success) {
      toast.success(message, { id: "loading" });
    } else {
      toast.error(message, { id: "loading" });
    }
  };
  const actualizarCarrito = (idProducto, cantidad) => {
    const productoConStock =
      productos.find((prod) => prod.id === idProducto).stock.cantidad -
      cantidad;
    // si la cantidad es menor o igual a 0, no se aumentar el stock en carrito
    if (productoConStock < 0) {
      toast.error("Producto sin stock disponible");
      return;
    } else {
      actualizarCantidadCarrito(idProducto, cantidad);
    }
  };
  const realizarVenta = async () => {
    const formVenta = new FormData();
    formVenta.append("cliente", clienteSeleccionado.id);
    formVenta.append(
      "total",
      carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
    ); // total de la venta

    const infoVentaPorTipo = obtenerInfoVentaTipo();

    console.log(infoVentaPorTipo);
    const infoVentaPorProducto = obtenerInfoVentaProducto();
    console.log(infoVentaPorProducto);
    // antes de enviar se convierte a JSON para que el backend pueda leerlo
    formVenta.append("info_venta_tipo", JSON.stringify(infoVentaPorTipo));
    formVenta.append(
      "info_venta_producto_id",
      JSON.stringify(infoVentaPorProducto)
    );

    // agregar productos

    const { success, message } = await createVentaContext(formVenta);

    if (success) {
      vaciarCarrito();
      Swal.fire({
        title: "Venta realizada",
        text: message,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
      });
    } else {
      Swal.fire({
        title: "Error al realizar la venta",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
      });
    }
    setOpcionCliente(true); // se vuelve a habilitar la opcion de seleccionar cliente
  };

  const validarCarrito = () => {
    const carritoSinCantidad = carrito.some(
      (prod) =>
        prod.cantidad === 0 || prod.cantidad === "0" || prod.cantidad === ""
    );
    if (carritoSinCantidad) {
      // sweetalert2
      Swal.fire({
        title: "Error al realizar la venta",
        text: "Seleccione la cantidad a vender para cada producto del carrito",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
      });
      return;
    } else {
      realizarVenta();
    }
  };

  const debounceAgregarProducto = debounce(agregarProducto, 100);
  const debounceActualizarCarrito = debounce(actualizarCarrito, 100);
  return (
    <div className="col-md-4">
      <MagicMotion className="carrito" name="carrito" duration={0.5}>
        <ul className="ul-carrito ps-1">
          {carrito?.map((producto) => (
            <li key={producto.id}>
              <div className="d-flex justify-content-between ps-1">
                <div>
                  <div
                    className="imagen-producto-mini"
                    onClick={() => eliminarProductoCarrito(producto.id)}
                  >
                    <img
                      src={
                        producto.imagen ||
                        "https://ww.idelcosa.com/img/default.jpg"
                      }
                      alt={producto.imagen ? "img" : "imagen por defecto"}
                      style={{ width: "30px", height: "26px" }}
                      className="img-min-producto"
                    />
                  </div>
                  <strong className="ps-1">{producto.nombre}</strong>
                  <div className="d-flex flex-column">
                    <div className="d-flex ps-4">
                      <input
                        type="number"
                        className="unidades-producto"
                        onChange={(e) => {
                          if (e.target.value > 99) {
                            e.target.value = e.target.value.slice(0, 2);
                          }
                          debounceActualizarCarrito(
                            producto.id,
                            e.target.value
                          );
                        }}
                        min="0"
                        max="99"
                        value={producto.cantidad}
                      />
                      <p className="mb-0">
                        /Unidades en ${producto.cantidad * producto.precio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <strong>${producto.precio}</strong>
                  <div className="d-flex justify-content-end">
                    <button
                      className="boton-restar d-flex align-items-center justify-content-center"
                      onClick={() => restarProductoCarrito(producto.id)}
                    >
                      -
                    </button>

                    <button
                      className="boton-sumar ms-1 d-flex align-items-center justify-content-center"
                      onClick={() => debounceAgregarProducto(producto)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {carrito?.length === 0 && (
            <div className="text-center" style={{ fontSize: "150px" }}>
              <i className="bi bi-cart-x"></i>
            </div>
          )}
        </ul>
        <hr className="linea-carrito" />
        <div className="d-flex justify-content-between gap-2 ps-2 btn-pago">
          <button
            className="btn btn-info form-control"
            disabled={carrito.length > 0 ? false : true}
            onClick={() => {
              alert("Proximamente!");
            }}
          >
            Cupon
          </button>
          <button
            className="btn btn-danger form-control"
            disabled={carrito.length > 0 ? false : true}
            onClick={vaciarCarrito}
          >
            Cancelar
          </button>
        </div>
        {clienteSeleccionado && !opcionCliente ? (
          <button onClick={() => ajustarOpciones()} className="d-flex align-items-center gap-2 pt-1 ps-2 button-especial">
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "40px" }}
              
            ></i>
            <p className="text-center m-0">
              {clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}
            </p>
          </button>
        ) : (
          <div className="d-flex align-items-center gap-3 pt-1 ps-2">
            <i className="bi bi-person-circle" style={{ fontSize: "40px" }}></i>
            <button className="btn border " onClick={() => setShowModal(true)}>
              Agregar Cliente
            </button>
            <button
              className="btn border"
              onClick={() => setShowListModal(true)}
            >
              Seleccionar Cliente
            </button>
          </div>
        )}
        <div className="d-flex justify-content-between gap-2 pt-2 ps-2">
          <strong>Total</strong>
          <strong>
            ${" "}
            {carrito?.reduce(
              (acc, prod) => acc + prod.precio * prod.cantidad,
              0
            )}
          </strong>
        </div>
        <div className="ps-2 btn-pago">
          <button
            disabled={
              clienteSeleccionado && !opcionCliente && carrito.length > 0
                ? false
                : true
            }
            className="btn btn-success form-control mt-2 ps-2"
            onClick={validarCarrito}
          >
            Pagar
          </button>
        </div>
      </MagicMotion>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroCliente cerrarModal={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>

      <Modal show={showListModal} onHide={() => setShowListModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListaClientes
            clientes={clientes}
            cerrarModal={() => setShowListModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
