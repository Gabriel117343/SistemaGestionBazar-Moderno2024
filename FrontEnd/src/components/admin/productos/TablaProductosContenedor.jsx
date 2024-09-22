import React, { useContext, useEffect, useState, useRef } from "react";
import { ValidarProductos } from "./TablaProductos";
import { ProductosContext } from "../../../context/ProductosContext";
import "./styles.css";

import { FormEdicion } from "./FormEdicion";
import { FormRegistroProductos } from "./FormRegistroProductos";
import { debounce } from "lodash";

// Para la UI
import CargaDeDatos from "../../../views/CargaDeDatos";
import { ButtonNew } from "../../shared/ButtonNew";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { Modal } from "react-bootstrap";

import useCategoriaStore from "../../../context/store/categoriaStore";
("../../../context/store/categoriaStore");
import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import CustomModal from "../../../views/CustomModal";

import { useSearchParams } from "react-router-dom";
import { paginaProductos } from "@constants/defaultParams.js";
import { ordenPorProductos } from "@constants/defaultOptionsFilter.js";
export const TablaProductosContenedor = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false); // Nuevo estado para la modal de registro

  const {
    stateProducto: { productos, cantidad, productoSeleccionado },
    eliminarProductoContext,
    getProductoContext,
    getProductosContext,
  } = useContext(ProductosContext);
  const { categorias, geAllCategoriasStore } = useCategoriaStore(); // se obtienen las categorias del store

  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const inputRef = useRef(null);
  const modalRef = useRef(null); // Referencia para el modal

  const parametrosDeConsulta = () => {
    return {
      page: searchParams.get("page"),
      page_size: paginaProductos.page_size ?? searchParams.get("page_size"),
      filtro: searchParams.get("filtro") ?? "",
      incluir_inactivos: searchParams.get("incluir_inactivos"),
      orden: searchParams.get("orden") ?? "",
    };
  };

  useEffect(() => {
    const parametros = parametrosDeConsulta();

    async function cargarProductos() {
      toast.loading("Cargando productos...", { duration: 2000, id: "toastId" });
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message } = await getProductosContext(parametros); // se ejecuta la funcion getProductos del contexto de los productos
      if (success) {
        setIsLoading(false);
        toast.success(message, { id: "toastId" });
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los productos",
          { id: "toastId" }
        );
      }
    }

    cargarProductos();
  }, [searchParams]);

  useEffect(() => {
    // se ejecuta la funcion cargarCategorias al montar el componente
    async function cargarCategorias() {
      const TOKEN_ACCESO = localStorage.getItem("accessToken");
      const { success, message } = await geAllCategoriasStore(TOKEN_ACCESO);
      if (!success) {
        toast.error(message ?? "Error inesperado al cargar las categorias");
      }
    }
    cargarCategorias();
  }, []);
  const borrarProducto = (id) => {
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
        toast.loading("Eliminando...", { id: "toastId" });
        setTimeout(async () => {
          const { success, message } = await eliminarProductoContext(id);
          if (success) {
            toast.success(message, { id: "toastId" });
          } else {
            toast.error(message, { id: "toastId" });
          }
        }, 1000);
      }
    }
    confirmar();
  };
  const edicionProducto = async (id) => {
    const { success, message } = await getProductoContext(id);
    if (success) {
      setShowModal(true);
    } else {
      toast.error(message);
    }
    setShowModal(!showModal);
  };

  const cerrarModal = () => {
    setShowRegistroModal(false); // Cerrar la modal de registro
    setShowModal(false);
  };

  const filtrarProductos = (filtro) => {
    const newFiltro = filtro.trim().toLowerCase();
    const ordenActual = searchParams.get("orden");
    // si el filtro esta vacio se reinician los parametros de busqueda por defecto
    setSearchParams({
      ...paginaProductos,
      // propagación condicional de objetos
      ...(ordenActual && { orden: ordenActual }),
      ...(newFiltro && { filtro: newFiltro }),
    });
  };
  const debounceFiltrarProductos = debounce(filtrarProductos, 400); // Debounce para retrazar la ejecucion de la funcion

  const handleOrdenarChange = (selectedOption) => {
    const filtroActivo = searchParams.get("filtro");
    // Nota: recordar que si un valor es "" su valor en el operador && es false
    setSearchParams({
      ...paginaProductos,
      // propagación condicional de objetos
      ...(selectedOption && { orden: selectedOption }),
      ...(filtroActivo && { filtro: filtroActivo }),
    });
  };
  const cambiarPagina = ({ newPage }) => {
    const filtroActivo = searchParams.get("filtro");
    const ordenActivo = searchParams.get("orden");
    // en caso haya un filtro activo, se mantiene de lo contrario se elimina
    setSearchParams({
      page: newPage,
      page_size: searchParams.get("page_size"),
      incluir_inactivos: searchParams.get("incluir_inactivos"),
      ...(filtroActivo && { filtro: filtroActivo }),
      ...(ordenActivo && { orden: ordenActivo }),
    });
  };
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);

  // Acciones extra
  const refrescarTabla = async () => {
    toast.loading("Refrescando", { id: "toastId" });

    const parametros = parametrosDeConsulta();
    const { success, message } = await getProductosContext(parametros);
    if (success) {
      toast.dismiss({ id: "toastId" });
      toast.success("Tabla refrescada", { id: "toastId" });
    } else {
      toast.dismiss({ id: "toastId" });
      toast.error(message ?? "Error inesperado al refrescar la tabla", {
        id: "toastId",
      });
    }
  };
  const imprimirTabla = () => {
    print();
  };

  return (
    <section className="pt-2">
      <div className="row d-flex mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={() => setShowRegistroModal(true)}>
            Nuevo
          </ButtonNew>
        </div>
        <div className="col-md-10 d-flex align-items-center gap-2">
          <label htmlFor="filtro">
            {" "}
            <i className="bi bi-search"></i>
          </label>

          <input
            ref={inputRef}
            className="form-control"
            id="filtro"
            type="text"
            /** En caso de que se recargue la página se mantienen el filtro consistente con la url **/
            defaultValue={searchParams.get("filtro")}
            placeholder="Buscar producto por nombre o código"
            onChange={(e) => debounceFiltrarProductos(e.target.value)}
          />
          <label htmlFor="orden">Orden:</label>

          {!searchParams.get("orden") && (
            <i className="bi bi-arrow-down-up"></i>
          )}
          {ordenPorProductos.map((option, index) => {
            const ordenActual = searchParams.get("orden") ?? "";
            if (option.value === ordenActual) {
              return <i key={index} className={option.classIcon} />;
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
            {ordenPorProductos.map((option) => (
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
        <ValidarProductos
          listaProductos={productos}
          borrarProducto={borrarProducto}
          edicionProducto={edicionProducto}
          currentPage={searchParams.get("page") || 1}
          cambiarPagina={cambiarPagina}
          cantidadDatos={cantidad}
          showModal={showModal}
          pageSize={paginaProductos.page_size}
        />
      )}

      <CustomModal
        ref={modalRef}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <CustomModal.Header>
          <h2>Título del Modal</h2>
        </CustomModal.Header>
        <CustomModal.Body>
          <FormEdicion
            producto={productoSeleccionado}
            cerrarModal={cerrarModal}
            categorias={categorias}
          />
        </CustomModal.Body>
      </CustomModal>
      <Modal
        show={showRegistroModal}
        onHide={() => setShowRegistroModal(false)}
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Registrar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroProductos
            cerrarModal={cerrarModal}
            categorias={categorias}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};
