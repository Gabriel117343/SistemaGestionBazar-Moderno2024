import { useContext, useEffect, useState, useRef } from "react";
import swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { Modal } from "react-bootstrap";
import { FormRegistroProveedores } from "./FormRegistroProveedores";
import { ValidarProveedores } from "./TablaProveedores";
import { debounce } from "lodash";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import CargaDeDatos from '../../../views/CargaDeDatos'
import "./styles.css";
// Para la UI
import { ButtonNew } from "../../shared/ButtonNew";
export const TablaProveedoresContenedor = () => {

  const {
    stateProveedor: { proveedores },
    eliminarProveedor,
    getProveedoresContext,
  } = useContext(ProveedoresContext);

  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState(proveedores); // Nuevo estado para el input de busqueda

  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para la carga de la pagina

  const inputFiltroRef = useRef(null); // Referencia al input de busqueda

  useEffect(() => {
    async function cargar () {
      toast.loading('Cargando...', { id: "loading" });
      const { success, message } = await getProveedoresContext(); // se ejecuta la funcion getProveedores del contexto de los proveedores
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: 'loading' });
      } else {
        toast.error(message ?? 'Ha ocurrido un error inesperado al cargar los Proveedores', { id: 'loading' });
      }
    };
    cargar();
  }, []);

  const borrarProveedor = (id) => {
    async function confirmar() {
      const aceptar = await swal.fire({
        title: "¿Estás seguro?",
        text: "Al eliminar el Proveedor se eliminaran todos sus productos asociados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (aceptar.isConfirmed) {
        toast.loading("Eliminando...", { id: "loading" });
        setTimeout(async () => {
          const { success, message } = await eliminarProveedor(id);
          if (success) {
            toast.success(message, { id: "loading" });
          } else {
            toast.error(message, { id: "loading", duration: 2000 });
          }
        }, 2000);
      }
    }
    confirmar();
  };
  
  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
  };
  const cambiarFiltro = (filtro) => {
    if (filtro.trim().length === 0) return setProveedoresFiltrados(proveedores); // si el input esta vacio no se filtra nada y se muestra la lista completa
    const nuevaLista = proveedores.filter(proveedor => {
      return (
        proveedor.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        proveedor.persona_contacto
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        proveedor.telefono.toLowerCase().includes(filtro.toLowerCase()) ||
        proveedor.direccion.toLowerCase().includes(filtro.toLowerCase())
      );
    })
    setProveedoresFiltrados(nuevaLista);
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 500); // Debounce para que no se ejecute la funcion cada vez que se escribe una letra
  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando...", { id: "toastId" });
    const { success, message } = await getProveedoresContext();
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada", { id: "toastId" });
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error(message ?? "error al refrescar la Tabla", { id: "toastId", duration: 2000 });
    }
  };
  // La primera vez la funcion se ejecuta inmediatamente, luego se ejecuta cada 2 segundos
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };
  const busquedaActiva = inputFiltroRef.current?.value.length > 0;
  return (
    <section className="pt-2">
      <div className="row d-flex mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <div className="col-md-10 d-flex gap-2 align-items-center">
          <i className="bi bi-search"></i>
          <input
           ref={inputFiltroRef}
            className="form-control"
            type="text"
            placeholder="Buscar por nombre, persona de contacto, telefono..."
            onChange={e => debounceCambiarFiltro(e.target.value)}
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
            <i className="bi bi-printer"></i>
          </button>
        </div>
      </div>
      { isLoading ? <CargaDeDatos /> : (
        <ValidarProveedores
        listaProveedores={busquedaActiva ? proveedoresFiltrados : proveedores}
        borrarProovedor={borrarProveedor}
      />
      )
      }
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroProveedores cerrarModal={cerrarModal} />
        </Modal.Body>
      </Modal>
    </section>
  );
};
