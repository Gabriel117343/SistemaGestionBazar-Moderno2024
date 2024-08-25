import { useContext, useEffect, useState, useRef } from "react";
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
import CargaDeDatos from '../../../views/CargaDeDatos'
export const ListaSeccionesContenedor = () => {

  const {
    stateSeccion: { secciones, seccionSeleccionada },
    eliminarSeccionContext,
    getSeccionContext,
    getSeccionesContext,
    actualizarSeccionContext,
    crearSeccionContext,
  } = useContext(SeccionesContext);
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const [isLoading, setIsLoading] = useState(true)
  const [seccionesFiltradas, setSeccionesFiltradas] = useState(secciones);
  const imputFiltroRef = useRef(null); // Referencia al input de busqueda

  useEffect(() => {
    toast.dismiss({ id: "loading" });
    async function cargar () {
      toast.loading('Cargando...', { duration: 2000, id: "loading" });
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message} = await getSeccionesContext(); // se ejecuta la funcion getProductos del contexto de los productos

      if (success) {
        setIsLoading(false);
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
  const cambiarFiltro = (filtro) => {
    if (filtro.trim().length === 0) return setSeccionesFiltradas(secciones); // si el input esta vacio no se filtra nada y se muestra la lista completa
    const nuevaLista = secciones.filter(seccion => {
      return seccion.nombre.toLowerCase().includes(filtro.toLowerCase()) || seccion.numero.toString().toLowerCase().includes(filtro.toLowerCase()) || seccion.descripcion.toLowerCase().includes(filtro.toLowerCase())
    })
    setSeccionesFiltradas(nuevaLista);
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
  const busquedaActiva = imputFiltroRef.current?.value.trim().length > 0;
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
            ref={imputFiltroRef}
            onChange={e => debounceCambiarFiltro(e.target.value)}
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
      {
        isLoading ? <CargaDeDatos /> : (
          <ValidarSecciones
          listaSecciones={busquedaActiva ? seccionesFiltradas : secciones}
          borrarSeccion={borrarSeccion}
          edicionSeccion={edicionSeccion}
   
          showModal={showModal}
        />
        )
      }
      
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
