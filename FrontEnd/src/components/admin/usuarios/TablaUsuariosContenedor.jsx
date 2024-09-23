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
import CargaDeDatos from "../../../views/CargaDeDatos";
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { useSearchParams } from "react-router-dom";

import { paginaUsuarios } from "@constants/defaultParams.js";
import { ordenPorUsuarios } from "@constants/defaultOptionsFilter.js";
export const TablaUsuariosContenedor = () => {
  const {
    stateUsuario: { usuarios, cantidad },
    deleteUsuario,
    getUsuario,
    getUsuarios,
  } = useContext(UsuariosContext);

  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const inputFiltroRef = useRef(null);

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaUsuarios.page,
      page_size: searchParams.get("page_size") ?? paginaUsuarios.page_size,
      orden: searchParams.get("orden") ?? "",
      filtro: searchParams.get("filtro") ?? "",
    };
  };

  useEffect(() => {
    toast.dismiss({ id: "toastId" });

    async function cargarUsuarios() {
      const parametros = parametrosDeConsulta();

      toast.loading("Cargando Usuarios...", { id: "toastId" });
      const { success, message } = await getUsuarios(parametros);
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "toastId" });
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los Usuarios",
          { id: "toastId" }
        );
      }
    }
    cargarUsuarios();
  }, [searchParams]);

  const borrarUsuario = (id) => {
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
        toast.loading("Eliminando...", { duration: 2000, id: "loading" });
        setTimeout(async () => {
          const { success, message } = await deleteUsuario(id);
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

    const newFiltro = filtro.trim().toLowerCase();

    const { page_size, orden } = parametrosDeConsulta()

    setSearchParams({
      page: 1,
      page_size: page_size,
      // Propagación condicional de propiedades
      ...(orden && { orden: orden }),
      ...(newFiltro && { filtro: newFiltro }),
    });

  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 400); // El usuario debe esperar 400ms para que se ejecute la función


  const handleOrdenarChange = (selectedOption) => {

    const { page_size } = parametrosDeConsulta()

    inputFiltroRef.current.value = "";
    const newOrden = {
      page: 1,
      page_size: page_size,
      ...(selectedOption && { orden: selectedOption }),

    };
    setSearchParams(newOrden);
  };

  const cambiarPagina = ({ newPage }) => {

    const { page_size, filtro, orden } = parametrosDeConsulta()

    setSearchParams({
      page: newPage,
      page_size: page_size,
      // Propagación condicional de propiedades, si son true se agregan al objeto, sino no se agregan
      ...(filtro && { filtro: filtro }),
      ...(orden && { orden: orden }),
    });
  };
  // Acciones
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });

    const parametros = parametrosDeConsulta();
    const { success, message } = await getUsuarios(parametros);
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error(message ?? "error al refrescar la Tabla");
    }
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const imprimirTabla = () => {
    print();
  };

  return (
    <section>
      <div className="d-flex row mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <div className="col-md-10 d-flex align-items-center gap-2">
          <label htmlFor="filtro">
            <i className="bi bi-search"></i>
          </label>

          <input
            ref={inputFiltroRef}
            className="form-control"
            type="text"
            id="filtro"
            defaultValue={searchParams.get("filtro")}
            placeholder="Buscar por rut, nombre, apellido o correo."
            onChange={(e) => debounceCambiarFiltro(e.target.value)}
          />

          <label htmlFor="orden">Orden:</label>

          {!searchParams.get("orden") && (
            <i className="bi bi-arrow-down-up"></i>
          )}
          {ordenPorUsuarios.map((option) => {
            const ordenActual = searchParams.get("orden") ?? "";
            if (option.value === ordenActual) {
              return <i className={option.classIcon} />;
            }
          })}
          <select
            id="orden"
            name="orden"
            className="form-select w-auto"
            onChange={(e) => handleOrdenarChange(e.target.value)}
            defaultValue={searchParams.get("orden")}
          >
            <option value="">Ninguno</option>
            {ordenPorUsuarios.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

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
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarUsuarios
          listaUsuarios={usuarios}
          borrarUsuario={borrarUsuario}
          currentPage={searchParams.get("page") || 1}
          cambiarPagina={cambiarPagina}
          cantidadDatos={cantidad}
          pageSize={parseInt(searchParams.get("page_size"))}
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
  //     <ValidarUsuarios listaUsuarios={stateUsuario.usuarios} borrarUsuario={borrarUsuario} edicionUsuario={edicionUsuario}/>

  //   </section>
  // )
};
