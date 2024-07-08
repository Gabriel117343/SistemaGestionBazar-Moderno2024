import { useState, useContext } from "react";
import { MagicMotion } from "react-magic-motion";
import { FormEdicion } from "./FormEdicion";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import "./styles.css";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
const MostrarTabla = ({
  listaProveedores,
  borrarProovedor,
}) => {
  const { stateProveedor: { proveedorSeleccionado }, getProveedorContext } = useContext(ProveedoresContext);
  const [showModal, setShowModal] = useState(false);
  const cerrarModal = () => {
    setShowModal(false);
  };
  

  const edicionProveedor = async (id) => {
    toast.loading("Cargando...", { id: "loading" });
    const { success, message } = await getProveedorContext(id);
    if (success) {
      toast.dismiss("loading")
      setShowModal(true);
    } else {
      toast.error(message ?? 'Ha ocurrido un Error inesperado', { id: "loading" });
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  // Se define la cantidad de usuarios a mostrar por pagina
  const cantidadProveedores = 10;
  // Calculando el índice de inicio y fin de la lista actual en función de la página actual y los elementos por página
  const startIndex = (currentPage - 1) * cantidadProveedores;
  const endIndex = startIndex + cantidadProveedores;
  // Obtener los elementos a mostrar en la página actual, slice filtrara el inicio a fin
  const proveedoresMostrar = listaProveedores.slice(startIndex, endIndex);
  // Servira para calcular el número total de páginas en función de la cantidad total de elementos y los elementos por página ej: el boton 1, 2, 3 etc..
  const totalBotones = Math.ceil(
    listaProveedores.length / cantidadProveedores
  ); // reverse para que la tabla muestre desde el ultimo usuario creado al primero
 
  return (
    <section>
      <table className="table table-striped table-hover mb-0" id="tabla-proveedores" style={{filter: showModal && 'blur(0.7px)'}}>
        <thead className="border-bottom">
          <tr>
            <th>#</th>
            <th>Fecha Creacion</th>
            <th>Nombre</th>
            <th>Persona Contacto</th>
            <th>Telefono</th>
            <th>Direccion</th>
            <th>Estado</th>
            <th colSpan={2} className="text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          <MagicMotion>
            {proveedoresMostrar.map((proveedor, index) => (
              <tr key={proveedor.id}>
                <td>{index + 1}</td>
                <td>{proveedor.fecha_creacion.substring(0, 10)}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.persona_contacto}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.direccion}</td>
                <td>
                  {proveedor.estado ? (
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
                    onClick={() => edicionProveedor(proveedor.id)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => borrarProovedor(proveedor.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </MagicMotion>
        </tbody>
      </table>
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros">
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Editar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormEdicion
            cerrarModal={cerrarModal}
            proveedor={proveedorSeleccionado}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

const SinProveedores = () => {
  return (
    <section className="pb-5">
      <table className="table table-striped">
        <thead className="border-bottom ">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Persona Contacto</th>
            <th>Telefono</th>
            <th>Direccion</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
      </table>
      
      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">No se han encontrado Proveedores Registrados</h5>
      </div>
    </section>
  );
};
export const ValidarProveedores = ({
  listaProveedores,
  borrarProovedor,
  filtro,
}) => {
  const validacion = listaProveedores.length > 0; // si listaProveedores es mayor a 0
  // si persona es igual a true o false
  // RENDERIZADO CONDICIONAL
  return validacion ? (
    <MostrarTabla
      listaProveedores={listaProveedores}
      borrarProovedor={borrarProovedor}
      filtro={filtro}
    />
  ) : (
    <SinProveedores />
  );
};
