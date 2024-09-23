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

import CargaDeDatos from "../../../views/CargaDeDatos";
import { useSearchParams } from "react-router-dom";
import { paginaSecciones } from "@constants/defaultParams";
import { ordenPorSecciones } from "@constants/defaultOptionsFilter";

export const ListaSeccionesContenedor = () => {
  const {
    stateSeccion: { secciones, cantidad, seccionSeleccionada },
    eliminarSeccionContext,
    getSeccionContext,
    getSeccionesContext,
    actualizarSeccionContext,
    crearSeccionContext,
  } = useContext(SeccionesContext);

  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const inputFiltroRef = useRef(null); // Referencia al input de busqueda

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page") ?? paginaSecciones.page,
      page_size: searchParams.get("page_size") ?? paginaSecciones.page_size,
      orden: searchParams.get("orden") ?? "",
      filtro: searchParams.get("filtro") ?? "",
    };
  };

  useEffect(() => {
    async function cargar() {
      toast.loading("Cargando...", { duration: 2000, id: "loading" });

      const parametros = parametrosDeConsulta();
      const { success, message } = await getSeccionesContext(parametros); // se ejecuta la funcion getProductos del contexto de los productos

      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "loading" });
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las Secciones",
          { duration: 2000, id: "loading" }
        );
      }
    }
    cargar();
  }, [searchParams]);

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
            toast.error(
              message ??
                "Ha ocurrido un error inesperado al eliminar la Sección",
              { id: "loading" }
            );
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
    const ordenActivo = searchParams.get("orden");
    const newFiltro = filtro.trim();
    setSearchParams({
      ...paginaSecciones,
      // Propagación condicional de objetos
      ...(ordenActivo && { orden: ordenActivo }),
      ...(newFiltro && { filtro: newFiltro }),
    })
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 400); // retrasa la ejucion de la funcion cambiar filtro por 300 milisegundos

  const handleOrdenarChange = (selectedOption) => {

    inputFiltroRef.current.value = "";
    // si la opción seleccionada es vacía, se elimina el parámetro orden y se mantiene el filtro activo si es que hay uno
    setSearchParams({
      ...paginaSecciones,
      ...(selectedOption && { orden: selectedOption }),
    })
  };
  const cambiarPagina = ({ newPage }) => {
    const filtroActivo = searchParams.get("filtro");
    const ordenActivo = searchParams.get("orden");

    // se mantienen los parametros de busqueda activos si es que hay alguno, sino se eliminan
    setSearchParams({
      page: newPage,
      page_size: parseInt(searchParams.get("page_size")),
      // propagación condicional de objetos
      ...(filtroActivo && { filtro: filtroActivo }),
      ...(ordenActivo && { orden: ordenActivo }),
    });
  };

  // ACCIONES EXTRA ------------------
  const refrescarTabla = async () => {
    toast.loading("Actualizando tabla...", { id: "loading" });
    const { success } = await getSeccionesContext();
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
      <div className="d-flex row mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nueva
          </ButtonNew>
        </div>

        <div className="col-md-10 d-flex align-items-center gap-2">
          <label htmlFor="filtro">
            <i className="bi bi-search"></i>
          </label>

          <input
            ref={inputFiltroRef}
            defaultValue={searchParams.get("filtro") ?? ""}
            onChange={(e) => debounceCambiarFiltro(e.target.value)}
            className="form-control"
            type="text"
            placeholder="Buscar por nombre o por numero..."
          />
          <label htmlFor="orden">Orden:</label>
          {!searchParams.get("orden") && (
            <i className="bi-bi-arrow-down-up"></i>
          )}
          {ordenPorSecciones.map((option) => {
            const ordenActual = searchParams.get("orden") ?? "";
            if (option.value === ordenActual) {
              return <i className={option.classIcon}></i>;
            }
          })}
          <select
            id="orden"
            name="orden"
            className="form-select w-auto"
            onChange={(e) => handleOrdenarChange(e.target.value)}
            defaultValue={searchParams.get("orden") ?? ""}
          >
            <option value="">Ninguno</option>
            {ordenPorSecciones.map((option) => (
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
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarSecciones
          listaSecciones={secciones}
          borrarSeccion={borrarSeccion}
          edicionSeccion={edicionSeccion}
          showModal={showModal}
          currentPage={searchParams.get("page") || 1}
          cambiarPagina={cambiarPagina}
          pageSize={parseInt(searchParams.get("page_size"))}
          cantidadDatos={cantidad}
        />
      )}

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
