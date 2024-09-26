import { MagicMotion } from "react-magic-motion";
import "./secciones.css";
import { PaginationButton } from "../../shared/PaginationButton";

const MostrarSecciones = ({
  listaSecciones,
  borrarSeccion,
  edicionSeccion,
  showModal,
  currentPage,
  cambiarPagina,
  cantidadDatos,
  pageSize,
}) => {
  console.log(currentPage, cantidadDatos, pageSize);
  return (
    <section>
      <table
        className="table table-striped table-hover table-bordered mt-2"
        style={{ filter: showModal && "blur(0.7px)" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Número</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <MagicMotion>
            {" "}
            {/* Cuando hay un cambio anima la tabla */}
            {listaSecciones.map((seccion, index) => (
              <tr key={seccion.id}>
                <td scope="row">{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{seccion.nombre}</td>
                <td>{seccion.numero}</td>
                <td>{seccion.descripcion}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      onClick={() => edicionSeccion(seccion.id)}
                      className="btn btn-outline-primary btn-nuevo-animacion"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      onClick={() => borrarSeccion(seccion.id)}
                      className="btn btn-outline-danger "
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </MagicMotion>
        </tbody>
      </table>
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros d-flex gap-1">
        <PaginationButton
          currentPage={currentPage}
          cambiarPagina={cambiarPagina}
          totalDatos={cantidadDatos}
          cantidadPorPagina={pageSize}
        />
      </div>
    </section>
  );
};
const SinSecciones = () => {
  return (
    <section>
      <table className="table table-striped table-hover table-bordered mt-2">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Número</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">No se han encontrado Secciones</h5>
      </div>
    </section>
  );
};
export const ValidarSecciones = ({ listaSecciones, ...props }) => {
  const validacion = listaSecciones?.length > 0; // valida si hay secciones , el resultado sera true o false
  return validacion ? (
    <MostrarSecciones listaSecciones={listaSecciones} {...props} />
  ) : (
    <SinSecciones />
  );
};
