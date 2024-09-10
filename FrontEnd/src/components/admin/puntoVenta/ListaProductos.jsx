import { useContext, useEffect } from "react";
import { MagicMotion } from "react-magic-motion";
import { toast } from "react-hot-toast";

import { CarritoContext } from "../../../context/CarritoContext";

import { PaginationButton } from "../../shared/PaginationButton";

import "./puntoventa.css";
export const ListaProductos = ({
  productos,
  currentPage,
  cambiarPagina,
  cantidadDatos,
  pageSize,
}) => {
  const { carrito, agregarProductoCarrito } = useContext(CarritoContext);

  const agregarProducto = async (producto) => {
    toast.loading("Agregando al carrito...", { id: "loading" });
    const { success, message } = await agregarProductoCarrito(producto);
    toast.dismiss({ id: "loading" }); // se cierra el toast de cargando
    if (success) {
      toast.success(message, { id: "loading" });
    } else {
      toast.error(message, { id: "loading" });
    }
  };

  return (
    <article>
      <ul className="productos">
        <MagicMotion duration={0.5}>
          {productos?.map((producto) => {
            // const stock = producto?.stock?.find(stock => stock.id === id)
            const cantidad = producto.stock.cantidad ?? 0; // se accede a la cantidad de productos en stock
            const stockProductoCarrito =
              carrito?.find((prod) => prod.id === producto.id)?.cantidad ?? 0; // se accede a la cantidad/stock del producto en el carrito

            const cantidadCalculada = cantidad - stockProductoCarrito;
            // cantidadCalculada lo que hace es restar la cantidad de productos en stock con la cantidad de productos que ya estan en el carrito
            // Es una forma de representar la cantidad de productos que se pueden agregar, no es la cantidad real que viene del stock del backend

            return (
              <li key={producto.id} className="producto">
                {cantidadCalculada <= 5 && (
                  <div className="icono-informativo">
                    <i className="bi bi-exclamation-circle"></i>
                  </div>
                )}
                <div
                  className={`producto-img ${cantidadCalculada === 0 ? "img-blanco-negro" : ""}`}
                >
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={`esto es una imagen de un ${producto.nombre}`}
                    />
                  ) : (
                    <img
                      width="100%"
                      height="150px"
                      src="https://ww.idelcosa.com/img/default.jpg"
                      alt="esta es una imagen por defecto"
                    />
                  )}
                </div>
                <div className="p-0 m-0 producto-info">
                  <p className="producto_nombre m-0">{producto.nombre}</p>
                  <div className="d-flex justify-content-center">
                    <p className="p-0 m-0 text-success precio-num">
                      ${producto.precio}
                    </p>
                    <div className="d-flex align-items-center stock-num">
                      <strong
                        className={`p-0 m-0 ps-2 d-flex align-items-center`}
                      >
                        Stock:
                      </strong>
                      <p
                        className={`${cantidadCalculada === 0 && "text-danger"}`}
                      >
                        {cantidadCalculada}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-0 mt-0 btn-agregar">
                  <button onClick={() => agregarProducto(producto)}>
                    <i className="bi bi-cart-plus"></i> Agregar
                  </button>
                </div>
              </li>
            );
          })}
        </MagicMotion>
      </ul>
      <div className="pt-1 d-flex gap-1">
        <PaginationButton
          currentPage={currentPage}
          cambiarPagina={cambiarPagina}
          totalDatos={cantidadDatos}
          cantidadPorPagina={pageSize}
        />
      </div>
    </article>
  );
};
const SinProductos = () => {
  return (
    <div className="pt-2">
      <h1 className="text-center pt-4">No se han encontrado Productos..</h1>
    </div>
  );
};
export const ValidarProductos = ({ productos, ...props }) => {
  const validacion = productos.length > 0;

  return (
    <>
      {validacion ? (
        <ListaProductos productos={productos} {...props} />
      ) : (
        <SinProductos />
      )}
    </>
  );
};
