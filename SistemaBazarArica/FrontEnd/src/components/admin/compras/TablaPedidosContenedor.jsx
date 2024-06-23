import { useContext, useState, useEffect, useRef } from "react";
import { PedidosContext } from "../../../context/PedidosContext";
import { toast } from "react-hot-toast";
import CargaDeDatos from '../../../views/CargaDeDatos'
import { ValidarPedidos } from "./TablaPedidos";
import { debounce } from "lodash";
import { FormOrdenCompra } from "./FormOrdenCompra";

// Para la UI
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
  useEffect(() => {
    const cargar = async() => {
      const { success, message } = await getPedidosContext();
      if (success) {
        toast.success(message ?? "Pedidos cargados");
        setIsLoading(false);
      } else {
        toast.error(message ?? "Ha ocurrido un error inesperado al cargar los pedidos");
      }
    };
    cargar();
  }, [formularioActivo]); // se ejecuta la funcion cargar al renderizar el componente
 
  const cambiarFiltro = (event) => {
     const nuevaLista = pedidos.filter((pedido) => pedido.proveedor.nombre.toLowerCase().includes(event.target.value.toLowerCase()));
     if (nuevaLista.length === 0) {
      console.log('vacio')
        setPedidosFiltrados([1]);
        return
     }
     setPedidosFiltrados(nuevaLista);

  };
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300); // se crea una funcion debounced para no hacer tantas peticiones al servidor
  const cambiarSeleccionForm = () => {
    setFormularioActivo(!formularioActivo);
  };

  const refrescarTabla = async () => {
    const toastId = toast.loading("Refrescando", { id: "toastId" });
    const { success } = await getPedidosContext();
    if (success) {
      toast.dismiss(toastId, { id: "toastId" });
      toast.success("Tabla refrescada");
    } else {
      toast.dismiss(toastId, { id: "toastId" });
      toast.error("error al refrescar la Tabla");
    }
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
            type="text"
            className="form-control"
            placeholder="Buscar Pedido"
            onChange={debounceCambiarFiltro}
          />
          <button
            className="btn btn-outline-primary btn-nuevo-animacion"
            onClick={refrescarTabla}
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
      {
        isLoading ? <CargaDeDatos />
        : <ValidarPedidos pedidos={pedidosFiltrados?.length > 0  ? pedidosFiltrados : pedidos} />
      }
    </>
  );
};
