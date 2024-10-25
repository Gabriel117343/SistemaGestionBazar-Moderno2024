import { useEffect, useState, useRef, useContext } from "react";

import { toast } from "react-hot-toast";

import { debounce } from "es-toolkit";

import { InputSearch } from "../../shared/InputSearch";
import { ButtonPrint, ButtonRefresh } from "../../shared/ButtonSpecialAccion";
import { useMagicSearchParams } from "../../../hooks/useMagicSearchParams";
import { ordenPorVentas } from "@constants/defaultOptionsFilter";
import { paginaVentas } from "@constants/defaultParams";

import { Modal } from "react-bootstrap";
import { SelectVendedor } from './vendedores/SelectVendedor'
import { UsuariosContext } from '../../../context/UsuariosContext'

export const FiltroVentas = ({ ventas, setIsLoading, getVentas }) => {
  const { mandatorios, opcionales } = paginaVentas;
  const {
    searchParams,
    actualizarParametros,
    limpiarParametros,
    obtenerParametros,
  } = useMagicSearchParams({ mandatory: mandatorios, optional: opcionales });


  const { stateUsuario: { usuarioSeleccionado } } = useContext(UsuariosContext);
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    toast.loading("Cargando ventas...", { id: "loading" });
    const cargarVentas = async () => {
      const parametros = obtenerParametros();
      const { success, message } = await getVentas(parametros);

      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las ventas",
          { id: "loading" }
        );
      } else {
        setIsLoading(false);
        toast.success(message ?? "Ventas cargadas correctamente", {
          id: "loading",
          duration: 2000,
        });
      }
    };
    cargarVentas();
  }, [searchParams]);


  const cambiarFiltro = (filtro) => {
    const newFiltro = filtro.trim().toLowerCase();
    actualizarParametros({ newParams: { filtro: newFiltro, page: 1 } });
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 400);

  const filtrarPorVendedor = (id) => {
    inputRef.current.value = "";

    const newSearch = { page: 1, vendedor: id };
    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false }, // no se mantiene el filtro
    });
  };
  const handleOrdenarChange = (selectedOption) => {
    const newSearch = { page: 1, orden: selectedOption };
    inputRef.current.value = "";
    actualizarParametros({
      newParams: newSearch,
      keepParams: { filtro: false },
    });
  };
  const refrescarTabla = async () => {
    const parametros = obtenerParametros();
    const { success, message } = await getVentas(parametros);
    if (!success) {
      toast.error(
        message ?? "Ha ocurrido un error inesperado al cargar las ventas"
      );
    } else {
      setIsLoading(false);
      toast.success(message ?? "Tabla actualizada correctamente");
    }
  };
  const debounceRefrescarTabla = debounce(refrescarTabla, 500);
  const imprimirTabla = () => {
    print();
  };

  const { vendedor, orden, filtro } = obtenerParametros({ convertir: true });

  const vendedorSeleccionado = usuarioSeleccionado
  return (
    <section>
      <div className="d-flex row align-items-center mb-2 ">
        <div className="col-md-3 d-flex align-items-center gap-2">

          {}
          <label htmlFor="vendedor">Vendedor:</label>
          <div
            className="form-select"
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            {vendedorSeleccionado ? vendedorSeleccionado.nombre : "Elegir Vendedor"}
          </div>
        </div>
        <div className="col-md-9 d-flex align-items-center gap-2">
          <label htmlFor="filtro" aria-label="Buscar">
            <i className="bi bi-search pe-1 pb-2"></i>
          </label>
          <InputSearch
            ref={inputRef}
            id="filtro" 
            onChange={(e) => debounceCambiarFiltro(e.target.value)}
            placeholder="Buscar por cliente"
            defaultValue={filtro}
          />
          <label htmlFor="orden">Orden:</label>

          {!orden && <i className="bi bi-arrow-down-up"></i>}
          {ordenPorVentas.map((option) => {
            const ordenActual = orden ?? "";
            if (option.value === ordenActual) {
              return <i key={option.value} className={option.classIcon} />;
            }
          })}
          <select
            id="orden"
            name="orden"
            className="form-select w-auto"
            onChange={(e) => handleOrdenarChange(e.target.value)}
            value={orden}
          >
            <option value="all">Ninguno</option>
            {ordenPorVentas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ButtonRefresh onClick={debounceRefrescarTabla} />
          <ButtonPrint onClick={imprimirTabla} />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Seleccionar Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/** Nota: Un Administrador también podría actuar como Vendedor */}
          <SelectVendedor  ventas={ventas} setShowModal={setShowModal}/>
        </Modal.Body>
      </Modal>
    </section>
  );
};
