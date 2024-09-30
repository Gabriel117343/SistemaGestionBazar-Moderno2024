import { useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { toast } from "react-hot-toast";

import { CarritoContext } from "../../../context/CarritoContext";
import { ProductoItemPrimary, ProductoItemSecondary } from "./ProductoItem";
import "./puntoventa.css";

export const ListaProductos = ({ productos, modoTabla, paginaActual, tamanoPagina }) => {
  const { carrito, agregarProductoCarrito } = useContext(CarritoContext);
  console.log('render lista productos')
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
  console.log({ paginaActual, tamanoPagina })
  const calcularCantidad = (producto) => {
    // Es una forma de representar la cantidad de productos que se pueden agregar, no es la cantidad real que viene del stock del backend
    const cantidad = producto.stock.cantidad;
    const stockProductoCarrito =
      carrito?.find((prod) => prod.id === producto.id)?.cantidad ?? 0;
    return cantidad - stockProductoCarrito;
  };
  const calcularContador = (index) => {

    return (paginaActual - 1) * tamanoPagina + index + 1;
  }

  return (
    <>
      {modoTabla ? (
        <table className="table table-striped table-hover table-bordered mt-2">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <MagicMotion>
              {productos?.map((producto, index) => (
                <ProductoItemSecondary
                  key={producto.id}
                  contador={calcularContador(index)}
                  producto={producto}
                  cantidadCalculada={calcularCantidad(producto)}
                  agregarProducto={agregarProducto}
                />
              ))}
            </MagicMotion>
          </tbody>
        </table>
      ) : (
        <ul className="productos">
          <MagicMotion duration={0.5}>
            {productos?.map((producto) => {
              return (
                <ProductoItemPrimary
                  key={producto.id}
                  producto={producto}
                  cantidadCalculada={calcularCantidad(producto)}
                  agregarProducto={agregarProducto}
                />
              );
            })}
          </MagicMotion>
        </ul>
      )}
    </>
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
