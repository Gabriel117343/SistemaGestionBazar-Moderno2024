import { useState, useEffect, useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { toast } from "react-hot-toast";
import { SidebarContext } from "../../../context/SidebarContext";
import { CarritoContext } from "../../../context/CarritoContext";
export const ListaProductos = ({ productos }) => {
  const { sidebar } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { carrito, agregarProductoCarrito } = useContext(CarritoContext);

  function calculoPaginas() {
    // se define la cantidad de productos por pagina dependiendo si esta en es md o lg
    // si el sidebar esta abierto o cerrado y si esta en una resolucion de 1700px o 1900pxs
    let productosPorPagina = 0;
    if (window.innerWidth < 1500 || (sidebar && window.innerWidth < 1900)) {
      productosPorPagina = 8;
    } else if (
      window.innerWidth >= 1500 &&
      window.innerWidth <= 1900 &&
      !sidebar
    ) {
      productosPorPagina = 10;
    } else if (
      window.innerWidth >= 1900 &&
      !sidebar &&
      window.innerHeight >= 900
    ) {
      productosPorPagina = 17;
    } else if (window.innerWidth >= 1900 && !sidebar) {
      console.log("d");
      productosPorPagina = 12;
    } else {
      productosPorPagina = 10;
    }
    return productosPorPagina;
  }
  useEffect(() => {
    setCurrentPage(1);
    // se setea la pagina actual a 1 cada vez que se cambie la cantidad de productos
  }, [productos.length]);

  // se calcula la cantidad de productos por pagina
  const cantidadPorPagina = calculoPaginas();
  // calculando el índice y fin de la lista actual en función de la página actual y los elementos por página

  const startIndex = (currentPage - 1) * cantidadPorPagina;
  const endIndex = startIndex + cantidadPorPagina;

  // Obtengo los elementos a mostrar en la página actual, slice filtrara el inicio a fin
  const productosMostrar = productos.slice(startIndex, endIndex);
  // Servira para calcular el número total de páginas en función de la cantidad total de elementos y los elementos por página ej: el boton 1, 2, 3 etc..
  const totalBotones = Math.ceil(productos.length / cantidadPorPagina);

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
          {productosMostrar?.map((producto) => {
            // const stock = producto?.stock?.find(stock => stock.id === id)
            const cantidad = producto.stock.cantidad ?? 0; // se accede a la cantidad de productos en stock
            const stockProductoCarrito =
              carrito?.find((prod) => prod.id === producto.id)?.cantidad ?? 0; // se accede a la cantidad/stock del producto en el carrito

            const cantidadCalculada = cantidad - stockProductoCarrito;
            // cantidadCalculada lo que hace es restar la cantidad de productos en stock con la cantidad de productos que ya estan en el carrito
            // Es una forma de representar la cantidad de productos que se pueden agregar, no es la cantidad real que viene del stock del backend
            return (
              <li key={producto?.id} className="producto">
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
                      src={producto.imagen.replace('http://localhost:8000/', 'https://dwq9c4nw-8000.brs.devtunnels.ms/')}
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
      <div className="pt-1">
        {Array.from({ length: totalBotones }, (_, index) => (
          <button
            key={index + 1}
            className={`btn ${currentPage === index + 1 ? "btn-info" : "btn-secondary"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </article>
  );
};
const SinProductos = () => {
  return (
    <div className="pt-2">
      <h1 className="text-center pt-4">No se han econtrado Productos..</h1>
    </div>
  );
};
export const ValidarProductos = ({ productos }) => {
  const validacion = productos.length > 0;

  return (
    <>
      {validacion ? <ListaProductos productos={productos} /> : <SinProductos />}
    </>
  );
};
