import { useState, createContext, useEffect } from "react";

export const CarritoContext = createContext();

const MENSAJES_CARRITO = {
  agregar: "Producto agregado al carrito!",
  agregar_error: "No hay stock disponible para este producto!",
  error_carrito: "Producto no encontrado en el carrito",
  aumentar: "Se aumentó la cantidad en el carrito",
  eliminar: "Producto eliminado del carrito!",
  restar: "Se redujo la cantidad en el carrito",
  actualizar: "Cantidad actualizada correctamente!",
  vaciar: "Carrito vaciado!",
  maximo_alcanzado: "Se ha alcanzado el máximo de productos en el carrito!",
};

export const CarritoProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem("carrito")) || [];

  const [carrito, setCarrito] = useState(initialState);

  // mantener el estado haún cuando se recargue la página
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarProductoCarrito = (producto) => {
    const productoEnCarrito = carrito.find((prod) => prod.id === producto.id);
    const productoConStock =
      producto.stock.cantidad - (productoEnCarrito?.cantidad ?? 0);

    if (productoConStock <= 0 || productoConStock === undefined) {
      return { success: false, message: MENSAJES_CARRITO.agregar_error };
    } else if (productoEnCarrito) {
      const productoActualizado = carrito.map((prod) => {
        if (prod.id === producto.id) {
          prod.cantidad += 1;
          return prod;
        } else {
          return prod;
        }
      });

      setCarrito(productoActualizado);
      return { success: true, message: MENSAJES_CARRITO.aumentar };
    } else if (productoConStock) {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      return { success: true, message: MENSAJES_CARRITO.agregar };
    } else {
      return { success: false, message: MENSAJES_CARRITO.agregar_error };
    }
  };
  const eliminarProductoCarrito = (productoId) => {
    const productoActualizado = carrito.filter(
      (prod) => prod.id !== productoId
    );
    setCarrito(productoActualizado);
  };
  const restarProductoCarrito = (productoId) => {
    // Se busca el producto en el carrito para saber si ya está agregado
    const productoEnCarrito = carrito.find((prod) => prod.id === productoId);

    if (productoEnCarrito.cantidad > 1) {
      const productoActualizado = carrito.map((prod) => {
        if (prod.id === productoId) {
          prod.cantidad -= 1;
          return prod;
        } else {
          return prod;
        }
      });

      setCarrito(productoActualizado);
    } else {
      eliminarProductoCarrito(productoId); // Si la cantidad es 1, se elimina el producto
    }
  };

  const actualizarCantidadCarrito = (productoId, cantidad) => {

    if (cantidad === 0 || cantidad.trim() === "") {
      const newCarrito = carrito.map((prod) => {
        if (prod.id === productoId) {
          prod.cantidad = 0;
          return prod;
        } else {
          return prod;
        }
      });

      setCarrito(newCarrito);
      return { type: "", message: "" };
    }

    const productoEnCarrito = carrito.find((prod) => prod.id === productoId);

    const productoConStock = productoEnCarrito.stock.cantidad - cantidad;

    const cantidadMaximaAlcanzada =
      parseInt(cantidad) === productoEnCarrito.cantidad;

    if (productoConStock <= 0 && !cantidadMaximaAlcanzada) {
      // para agregar el todo el stock disponible en caso de que la cantidad sea mayor al stock, mejora la experiencia de usuario

      const productoActualizado = carrito.map((prod) => {
        if (prod.id === productoId) {
          prod.cantidad = prod.stock.cantidad;

          return prod;
        } else {
          return prod;
        }
      });
      setCarrito(productoActualizado);
      return { type: "info", message: MENSAJES_CARRITO.maximo_alcanzado };
    } else if (productoConStock > 0) {
 
      const productoActualizado = carrito.map((prod) => {
        if (prod.id === productoId) {
          prod.cantidad = cantidad;
          return prod;
        } else {
          return prod;
        }
      });

      setCarrito(productoActualizado);
      return { type: "success", message: MENSAJES_CARRITO.actualizar };
    } else {
      return { type: "error", message: MENSAJES_CARRITO.agregar_error };
    }
  };
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProductoCarrito,
        eliminarProductoCarrito,
        restarProductoCarrito,
        vaciarCarrito,
        actualizarCantidadCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
