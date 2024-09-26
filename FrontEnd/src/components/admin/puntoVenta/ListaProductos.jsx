import { useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { toast } from "react-hot-toast";

import { CarritoContext } from "../../../context/CarritoContext";
import { ProductoItem } from "./ProductoItem";
import "./puntoventa.css";
export const ListaProductos = ({ productos }) => {
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
            <ProductoItem
              key={producto.id}
              producto={producto}
              cantidadCalculada={cantidadCalculada}
              agregarProducto={agregarProducto}
            />
          );
        })}
      </MagicMotion>
    </ul>
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
