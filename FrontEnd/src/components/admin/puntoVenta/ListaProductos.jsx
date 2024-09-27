import { useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { toast } from "react-hot-toast";

import { CarritoContext } from "../../../context/CarritoContext";
import { ProductoItemPrimary, ProductoItemSecondary } from "./ProductoItem";
import "./puntoventa.css";

export const ListaProductos = ({ productos, modoTabla }) => {
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

  const calcularCantidad = (producto) => {
    // Es una forma de representar la cantidad de productos que se pueden agregar, no es la cantidad real que viene del stock del backend
    const cantidad = producto.stock.cantidad ?? 0;
    const stockProductoCarrito =
      carrito?.find((prod) => prod.id === producto.id)?.cantidad ?? 0;
    return cantidad - stockProductoCarrito;
  };

  return (
    <>
      {modoTabla ? (
        <table className="table table-striped table-hover table-bordered mt-2">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <MagicMotion>
              {productos?.map((producto) => (
                <ProductoItemSecondary
                  key={producto.id}
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
