import React, { useContext, useEffect, useState, useRef } from "react";
import { ValidarUsuarios } from "./TablaUsuarios";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { UsuariosContext } from "../../../context/UsuariosContext";
import "./styles.css";
import { Modal } from "react-bootstrap";
import { FormularioEdicion } from "./FormularioEdicion";
import { FormRegistroUsuarios } from "./FormRegistroUsuarios";
import { debounce } from "lodash";
/** Para la UI */
import { ButtonNew } from "../../shared/ButtonNew";
import CargaDeDatos from '../../../views/CargaDeDatos'
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
export const TablaUsuariosContenedor = () => {

  const {
    stateUsuario: { usuarios },
    deleteUsuario,
    getUsuario,
    getUsuarios,
  } = useContext(UsuariosContext);
  
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios); // Nuevo estado para el input de busqueda

  const inputFiltroRef = useRef(null);
  useEffect(() => { 
    toast.dismiss({ id: "toastId" });
    
    async function cargarUsuarios () {
      toast.loading("Cargando Usuarios...", { duration: 2000, id: "toastId"});
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message } = await getUsuarios();
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "toastId" });
        setIsLoading(false);
      } else {
        toast.error(message ?? "Ha ocurrido un error inesperado al cargar los Usuarios", { id: "toastId" });
      }
    }
    cargarUsuarios()
  }, []);

  const borrarPersona = (id) => {
    async function confirmar() {
      const aceptar = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", //
        cancelButtonColor: "#d33",
      });
      if (aceptar.isConfirmed) {
        toast.loading("Eliminando...", { duration: 2000, id: 'loading' });
        setTimeout(async () => {
          const { success, message } = await deleteUsuario(id);
          if (success) {
            toast.success(message, { id: 'loading'});
          } else {
            toast.error(message, { id: 'loading', duration: 2000 });
          }
        }, 2000);
      }
    }
    confirmar();
  };

  const edicionUsuario = async (id) => {
    const usuario = await getUsuario(id);
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
    setShowModal(false); // Cerrar la modal de edicion
  };
  const cambiarFiltro = (filtro) => {
    if (filtro.trim().length === 0) {
      setUsuariosFiltrados(usuarios);
      return
    }
    const resultadoFiltro = usuarios.filter(usuario => {
      return usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.rut.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.telefono.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.rol.toLowerCase().includes(filtro.toLowerCase())
    })
    setUsuariosFiltrados(resultadoFiltro);

  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300); // Debounce para retrazar la ejecucion de la funcion cambiarFiltro
  // Acciones
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });
    const { success } = await getUsuarios();
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error("error al refrescar la Tabla");
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };
  const filtroActivo = inputFiltroRef.current?.value.length > 0;
  return (
    <section>
      <div className="row d-flex mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <div className="col-md-10 d-flex gap-2 align-items-center">
          <i class="bi bi-search"></i>
          <input
            ref={inputFiltroRef}
            className="form-control"
            type="text"
            placeholder="Buscar por nombre, apellido, edad, telefono, rut, email..."
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
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      )
      : (
        <ValidarUsuarios
        listaPersonas={filtroActivo ? usuariosFiltrados : usuarios}
        borrarPersona={borrarPersona}
        edicionUsuario={edicionUsuario}
        showModal={showModal}
      />
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí va tu formulario de edición. Puedes pasar usuarioSeleccionado como prop a tu formulario */}
          <FormularioEdicion
            usuario={usuarioSeleccionado}
            cerrarModal={cerrarModal}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroUsuarios cerrarModal={cerrarModal} />
        </Modal.Body>
      </Modal>
    </section>
  );
  // return (
  //   <section className='pt-2'>
  //     <ValidarUsuarios listaPersonas={stateUsuario.usuarios} borrarPersona={borrarPersona} edicionUsuario={edicionUsuario}/>

  //   </section>
  // )
};
