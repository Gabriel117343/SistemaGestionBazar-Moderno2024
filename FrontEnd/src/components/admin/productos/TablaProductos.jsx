import { useState } from "react";
import { MagicMotion } from "react-magic-motion";
import "./styles.css";
import { PaginationButton } from "../../shared/PaginationButton";
import useFiltroDatosMostrar from "../../../hooks/useFiltroDatosMostrar";
const MostrarProductos = ({
  listaProductos,
  borrarProducto,
  edicionProducto,
  showModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Se define la cantidad de usuarios a mostrar por pagina
  const cantidadProductos = 10;

  const productosMostrar = useFiltroDatosMostrar({
    currentPage,
    datosPorPagina: cantidadProductos,
    datos: listaProductos.toReversed(),
  });
  return (
    <section>
      <table
        className="table table-striped table-hover mb-0"
        id="tabla-productos"
        style={{ filter: showModal && "blur(0.7px)" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Secction</th>
            <th>Codigo</th>
            <th>tipo</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Estado</th>
            <th colSpan={2} className="text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Cuando hay un cambio anima la tabla */}
          <MagicMotion>
            {productosMostrar.map((producto, index) => (
              <tr key={producto.id}>
                <td>{(currentPage - 1) * cantidadProductos + index + 1}</td>
                <td className="text-capitalize">{producto.nombre}</td>
                <td>{producto.seccion.nombre}</td>
                <td>{producto.codigo}</td>
                <td className="text-capitalize">{producto.tipo}</td>
                <td>$ {producto.precio}</td>
                <td>{producto.proveedor.nombre}</td>
                <td>
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
                <td className="text-center">
                  <button
                    className="btn btn-info"
                    onClick={() => edicionProducto(producto.id)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => borrarProducto(producto.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </MagicMotion>
        </tbody>
      </table>
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros d-flex gap-1">
        <PaginationButton
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalDatos={listaProductos.length}
          cantidadPorPagina={cantidadProductos}
        />
      </div>
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
            <th>Secction</th>
            <th>Codigo</th>
            <th>tipo</th>
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
  const validacion = listaProductos.length > 0;
  return validacion ? (
    <MostrarProductos listaProductos={listaProductos} {...props} />
  ) : (
    <SinProductos />
  );
};
