import { useContext, useState, useEffect, useRef } from "react";
import { PedidosContext } from "../../../context/PedidosContext";
import { toast } from "react-hot-toast";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { ValidarPedidos } from "./TablaPedidos";
import { debounce } from "lodash";
import { FormOrdenCompra } from "./FormOrdenCompra";
import { ButtonNew } from "../../shared/ButtonNew";
import ReactToPrint from "react-to-print";

import "./compras.css";
export const TablaPedidosContenedor = () => {
  const {
    statePedido: { pedidos },
    getPedidosContext,
  } = useContext(PedidosContext);
  const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidos); // Nuevo estado para el input de busqueda
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef(); // referencia al componente que se imprimira
  const inputRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      const { success, message } = await getPedidosContext();
      if (success) {
        toast.success(message ?? "Pedidos cargados");
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los pedidos"
        );
      }
    };
    cargar();
  }, [formularioActivo]); // se ejecuta la funcion cargar al renderizar el componente

  const cambiarFiltro = (event) => {
    const texto = event.target.value.toLowerCase().trim();
    if (texto.length === 0) return setPedidosFiltrados(pedidos); // si el input esta vacio no se filtra nada y se muestra la lista completa
    const nuevaLista = pedidos.filter(
      (pedido) =>
        pedido.proveedor.nombre.toLowerCase().includes(texto) ||
        pedido.codigo.toLowerCase().includes(texto)
    );

    setPedidosFiltrados(nuevaLista);
  };
  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });
    const { success, message } = await getPedidosContext();
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error(message ?? "error al refrescar la Tabla");
    }
  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300); // se crea una funcion debounced para no hacer tantas peticiones al servidor
  const debounceRefrescarTabla = debounce(refrescarTabla, 300);
  const cambiarSeleccionForm = () => {
    setFormularioActivo(!formularioActivo);
  };

  

  return formularioActivo ? (
    <FormOrdenCompra volver={cambiarSeleccionForm} />
  ) : (
    <>
      <div className="row d-flex mb-2">
        <div className="col-md-2">
          <ButtonNew onClick={cambiarSeleccionForm}>Nuevo Pedido</ButtonNew>
        </div>
        <div className="col-md-10 d-flex align-items-center justify-content-center gap-2">
          <i className="bi bi-search"></i>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Buscar Pedido"
            onChange={debounceCambiarFiltro}
          />
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={debounceRefrescarTabla}
          >
            <i className="bi bi-arrow-repeat"></i>
          </button>

          <ReactToPrint
            trigger={() => (
              <button className="btn btn-outline-primary btn-nuevo-animacion">
                <i className="bi bi-printer"></i>
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarPedidos refrescar={refrescarTabla}
          pedidos={
            inputRef?.current?.value?.length > 0 ? pedidosFiltrados : pedidos
          }
        />
      )}
    </>
  );
};
