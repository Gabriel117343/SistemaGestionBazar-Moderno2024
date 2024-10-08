import { MagicMotion } from "react-magic-motion";
import "./styles.css";

import { useId } from "react";
const MostrarProductos = ({
  listaProductos,
  borrarProducto,
  edicionProducto,
  currentPage,

  showModal,
  pageSize,
}) => {
  const id = useId(); // Genera un id único para la tabla de productos, el mismo en server y client

  return (
    <section>
      <table
        className="table table-striped table-hover mb-0"
        id={`${id}-tabla-productos`}
        style={{ filter: showModal && "blur(0.7px)" }}
      >
        <thead>
          <tr>
            <th id={`${id}-th-#`}>#</th>
            <th id={`${id}-th-nombre`}>Nombre</th>
            <th id={`${id}-th-seccion`}>Sección</th>
            <th id={`${id}-th-codigo`}>Código</th>
            <th id={`${id}-th-categoria`}>Categoría</th>
            <th id={`${id}-th-precio`}>Precio</th>
            <th id={`${id}-th-proveedor`}>Proveedor</th>
            <th id={`${id}-th-estado`}>Estado</th>
            <th id={`${id}-th-opciones`} colSpan={2} className="text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Cuando hay un cambio anima la tabla */}
          <MagicMotion>
            {listaProductos.map((producto, index) => {
              const contador = (currentPage - 1) * pageSize + index + 1;
              return (
                <tr key={producto.id}>
                  <td id={`${id}-td-#-${producto.id}`}>{contador}</td>
                  <td
                    id={`${id}-td-nombre-${producto.id}`}
                    className="text-capitalize"
                  >
                    {producto.nombre}
                  </td>
                  <td id={`${id}-td-seccion-${producto.id}`}>
                    {producto.seccion.nombre}
                  </td>
                  <td id={`${id}-td-codigo-${producto.id}`}>
                    {producto.codigo}
                  </td>
                  <td
                    id={`${id}-td-categoria-${producto.id}`}
                    className="text-capitalize"
                  >
                    {producto.categoria.nombre}
                  </td>
                  <td id={`${id}-td-precio-${producto.id}`}>
                    $ {producto.precio}
                  </td>
                  <td id={`${id}-td-proveedor-${producto.id}`}>
                    {producto.proveedor.nombre}
                  </td>
                  <td id={`${id}-td-estado-${producto.id}`}>
                    {producto.estado ? (
                      <div
                        style={{ borderRadius: "35px" }}
                        className="border d-flex justify-content-center bg-success text-white"
                      >
                        <p className="m-0">Activo</p>
                      </div>
                    ) : (
                      <div
                        style={{ borderRadius: "35px" }}
                        className="border d-flex d-flex justify-content-center bg-danger text-white"
                      >
                        <p className="m-0">Inactivo</p>
                      </div>
                    )}
                  </td>
                  <td
                    id={`${id}-td-opciones-edicion-${producto.id}`}
                    className="text-center"
                  >
                    <button
                      className="btn btn-info"
                      onClick={() => edicionProducto(producto.id)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </td>
                  <td
                    id={`${id}-td-opciones-borrar-${producto.id}`}
                    className="text-center"
                  >
                    <button
                      className="btn btn-danger"
                      onClick={() => borrarProducto(producto.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </MagicMotion>
        </tbody>
      </table>
      
    </section>
  );
};
const SinProductos = () => {
  return (
    <section>
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Sección</th>
            <th>Código</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Estado</th>
            <th colSpan={2} className="text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        <h4 className="text-center">No se han encontrado Productos</h4>
      </div>
    </section>
  );
};
export const ValidarProductos = ({ listaProductos, ...props }) => {
  const validacion = listaProductos?.length > 0;
  return validacion ? (
    <MostrarProductos listaProductos={listaProductos} {...props} />
  ) : (
    <SinProductos />
  );
};
