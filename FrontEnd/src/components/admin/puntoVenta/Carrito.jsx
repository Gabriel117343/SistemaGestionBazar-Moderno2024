import { useState, useEffect, useContext, useRef } from "react";
import { MagicMotion } from "react-magic-motion";
import { Modal } from "react-bootstrap";
import { FormRegistroCliente } from "./FormRegistroCliente";

import { ListaClientes } from "./ListaClientes";
import { ClientesContext } from "../../../context/ClientesContext";
import { CarritoContext } from "../../../context/CarritoContext";
import { ProductosContext } from "../../../context/ProductosContext";

import { VentasContext } from "../../../context/VentasContext";
import { toast } from "react-hot-toast";
import useTransformarDatosVenta from "../../../hooks/useTransformarDatosVenta";
import { useSearchParams } from "react-router-dom";

import "./puntoventa.css";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { CartOutlineX } from '../../ui/svg/CartSvg'
export const Carrito = () => {
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [opcionCliente, setOpcionCliente] = useState(true);
  const { createVentaContext } = useContext(VentasContext);
  const {
    stateCliente: { clientes, clienteSeleccionado },
    getClientesContext,
  } = useContext(ClientesContext);
  // Contexto de carrito
  const infoVenta = useTransformarDatosVenta();
  const {
    carrito,
    agregarProductoCarrito,
    eliminarProductoCarrito,
    restarProductoCarrito,
    vaciarCarrito,
    actualizarCantidadCarrito,
  } = useContext(CarritoContext);
  const { getProductosContext } = useContext(ProductosContext);

  const inputStockRef = useRef(null);
  // se obtienen los parametros de la url para realizar la consulta
  const [searchParams] = useSearchParams();

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

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page"),
      page_size: searchParams.get("page_size"),
      filtro: searchParams.get("filtro") ?? "",
      categoria: searchParams.get("categoria") ?? "",
      seccion: searchParams.get("seccion") ?? "",
      incluir_inactivos: searchParams.get("incluir_inactivos"),
      orden: searchParams.get("orden") ?? "",
    };
  };

  const agregarProducto = async (producto) => {
    // en vez de útilzar una promesa, se utiliza async await para esperar la respuesta y obtener el mensaje (es más limpio, facil de entender y rapido)
    const { success, message } = await agregarProductoCarrito(producto);

    if (success) {
      toast.success(message, { id: "loading" });
    } else {
      toast.error(message, { id: "loading" });
    }
  };
  const actualizarCarrito = async (idProducto, cantidad) => {
    toast.dismiss({ id: "loading" });
    const { type, message } = await actualizarCantidadCarrito(
      idProducto,
      cantidad
    );
    if (type === "success") {
      toast.success(message, { id: "update cart" });
    } else if (type === "info") {
      toast(message, { id: "update cart", icon: "🛒" });
    } else if (type === "error") {
      toast.dismiss({ id: "update cart" });
      toast.error(message, { id: "update cart" });
    } else {
      toast.dismiss({ id: "update cart" });
    }
  };
  const refrescarProductos = async () => {
    const parametros = parametrosDeConsulta();

    const { success, message } = await getProductosContext(parametros);
    console.log(message ?? "Productos cargados");
    if (!success) {
      toast.error(message ?? "Error al cargar los productos");
    }
  };
  const realizarVenta = async () => {
    const formVenta = new FormData();
    formVenta.append("cliente", clienteSeleccionado.id);
    formVenta.append(
      "total",
      carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
    ); // total de la venta

    const informacionAdicional = infoVenta(carrito);

    formVenta.append("info_venta_json", JSON.stringify(informacionAdicional));

    // agregar productos

    const { success, message } = await createVentaContext(formVenta).finally(
      () => {
        refrescarProductos(); //
      }
    );

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
  const debounceActualizarCarrito = debounce(actualizarCarrito, 50);
  return (
    <>
      <MagicMotion name="carrito" duration={0.5}>
        <div className="container-carrito">
          {carrito?.map((producto) => (
            <div key={producto.id} className="producto-item">
              <div className="d-flex justify-content-between ps-1">
                <div>
                  <div
                    className="imagen-producto-mini"
                    onClick={() => eliminarProductoCarrito(producto.id)}
                  >
                    <img
                      loading="lazy"
                      src={
                        producto.imagen ||
                        "https://ww.idelcosa.com/img/default.jpg"
                      }
                      alt={`imagen de ${producto.nombre}`}
                      className="img-min-producto"
                    />
                  </div>

                  <label
                    onClick={() => debounceActualizarCarrito(producto.id, 0)}
                    className="ps-1"
                    htmlFor={`producto-${producto.id}`}
                  >
                    <strong>{producto.nombre}</strong>
                  </label>
                  <div className="d-flex flex-column">
                    <div className="d-flex ps-4">
                      <input
                        type="number"
                        id={`producto-${producto.id}`}
                        name="unidades"
                        className="unidades-producto"
                        onChange={(e) => {
                          // Nota: el valor de un input siempre es un string, por lo que se debe convertir a entero

                          debounceActualizarCarrito(
                            producto.id,
                            parseInt(e.target.value)
                          );
                        }}
                        min="0"
                        max="99"
                        value={
                          producto.cantidad !== 0 ? producto.cantidad : "0"
                        }
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
            </div>
          ))}
          {carrito?.length === 0 && (
            <div className="d-flex justify-content-center align-items-center pt-2">
             <CartOutlineX width={150} height={150} fill="black" />
            </div>
          )}
        </div>

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
          <button
            onClick={() => ajustarOpciones()}
            className="d-flex align-items-center gap-2 pt-1 ps-2 button-especial"
          >
            <i className="bi bi-person-circle" style={{ fontSize: "40px" }}></i>
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
    </>
  );
};
