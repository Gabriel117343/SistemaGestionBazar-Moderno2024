import { useContext, useEffect, useState } from "react";
import { ValidarSecciones } from "./ListaSecciones";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { SeccionesContext } from "../../../context/SeccionesContext";
import "./secciones.css";
import { Modal } from "react-bootstrap";
import { FormEdicion } from "./FormEdicion";
import { FormRegistroSecciones } from "./FormRegistroSecciones";
import { debounce } from "lodash";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { ButtonNew } from "../../shared/ButtonNew";
export const ListaSeccionesContenedor = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro
  const [seccionBuscada, setSeccionBuscada] = useState(null); // Nuevo estado para el input de busqueda
  const {
    stateSeccion: { secciones, seccionSeleccionada },
    eliminarSeccionContext,
    getSeccionContext,
    getSeccionesContext,
    actualizarSeccionContext,
    crearSeccionContext,
  } = useContext(SeccionesContext);

  useEffect(() => {
    toast.dismiss({ id: "loading" });
    async function cargar () {
      toast.loading('Cargando...', { duration: 2000, id: "loading" });
      const { success, message} = await getSeccionesContext(); // se ejecuta la funcion getProductos del contexto de los productos

      if (success) {
        toast.success(message, { id: 'loading' });
      } else {
  
        toast.error(message ?? 'Ha ocurrido un error inesperado al cargar las Secciones', { duration: 2000, id: 'loading' });
      }
    };
    cargar();
  }, []);

  const borrarSeccion = (id) => {
    async function confirmar() {
      const aceptar = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Se eliminaran todos los productos asociados a esta Seccion",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (aceptar.isConfirmed) {
        toast.loading("Eliminando...", { duration: 2000, id: "loading" });
        setTimeout(async () => {
          const { success, message } = await eliminarSeccionContext(id);
          if (success) {
            toast.success(message, { id: "loading" });
          } else {
            toast.error(message ?? 'Ha ocurrido un error inesperado al eliminar la Sección', { id: "loading" });
          }
        }, 2000);
      }
    }
    confirmar();
  };
  const edicionSeccion = async (id) => {
    toast.loading("Editando...", { id: "loading" });
    const { success, message } = await getSeccionContext(id);
    if (success) {
      setShowModal(true);
      toast.dismiss("loading");
    } else {
      toast.error(message, { id: "loading", duration: 2000 });
    }
  };
  const cerrarModal = () => {
    setShowModal(false);
    setShowRegistroModal(false); // Cerrar la modal de registro
  };
  const cambiarFiltro = (event) => {
    event.preventDefault();
    const filtro = event.target.value;
    setSeccionBuscada(filtro); // Guarda el nuevo filtro en el estado
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300); // retrasa la ejucion de la funcion cambiar filtro por 300 milisegundos
  // ACCIONES EXTRA ------------------
  const refrescarTabla = async () => {
    
    toast.loading("Actualizando tabla...", { id: "loading" });
    const { success } = await getSeccionesContext()
    toast.dismiss("loading");

    if (success) {
      toast.success("Tabla actualizada");
    } else {
      toast.error("Error al actualizar la tabla");
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };

  return (
    <section className="pt-2">
      <div className="row">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nueva
          </ButtonNew>
        </div>

        <div className="col-md-10 d-flex align-items-center gap-3">
          <i className="bi bi-search"></i>
          <input
            onChange={debounceCambiarFiltro}
            className="form-control"
            type="text"
            placeholder="Buscar por nombre, numero, descripcion..."
          />
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={debounceRefrescarTabla}
          >
            <i className="bi bi-arrow-repeat"></i>
          </button>
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={imprimirTabla}
          >
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>
      <ValidarSecciones
        listaSecciones={secciones}
        borrarSeccion={borrarSeccion}
        edicionSeccion={edicionSeccion}
        filtro={seccionBuscada}
        showModal={showModal}
      />
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Seccion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormEdicion
            cerrarModal={cerrarModal}
            seccion={seccionSeleccionada}
            actualizarSeccion={actualizarSeccionContext}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showRegistroModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Seccion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroSecciones
            cerrarModal={cerrarModal}
            crearSeccion={crearSeccionContext}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};
