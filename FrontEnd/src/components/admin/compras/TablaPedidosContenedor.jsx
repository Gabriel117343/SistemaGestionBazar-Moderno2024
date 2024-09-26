import { useContext, useState, useEffect, useRef } from "react";
import { PedidosContext } from "../../../context/PedidosContext";

import { toast } from "react-hot-toast";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { ValidarPedidos } from "./TablaPedidos";
import { debounce } from "lodash";

import useRefreshDebounce from "../../../hooks/useRefreshDebounce";
import { FormOrdenCompra } from "./FormOrdenCompra";
import { ButtonNew } from "../../shared/ButtonNew";
import ReactToPrint from "react-to-print";

import { InputSearch } from '../../shared/InputSearch';
import { ButtonPrint, ButtonRefresh } from '../../shared/ButtonSpecialAccion'
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
      toast.loading("Cargando...", { id: 'loading' });
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message } = await getPedidosContext();
      if (success) {
        toast.success(message ?? "Pedidos cargados", { id: 'loading' });
        setIsLoading(false);
      } else {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar los pedidos", { id: 'loading', duration: 2000 }
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
  // Este hook hará que la primera vez se llame a la función inmediatamente y luego se llame cada 2 segundos.
  const debounceRefrescarTabla = useRefreshDebounce(refrescarTabla, 2000);
  const cambiarSeleccionForm = () => {
    setFormularioActivo(!formularioActivo);
  };

  return formularioActivo ? (
    <FormOrdenCompra volver={cambiarSeleccionForm} />
  ) : (
    <>
      <div className="column d-flex mb-2 gap-1">
        <div className="col-md-2 col-sm-2 col-xs-2 ">
          <ButtonNew onClick={cambiarSeleccionForm}>Nuevo Pedido</ButtonNew>
        </div>
        <div className="col-md-10 col-sm-10 col-xs-11 d-flex align-items-center justify-content-center gap-2">
          <label htmlFor="filtro">
            <i className="bi bi-search"></i>
          </label>
          <InputSearch
            ref={inputRef}
            id="filtro"
            placeholder="Buscar pedido"
            onChange={e => debounceCambiarFiltro(e.target.value)}
          />
          <ButtonRefresh onClick={debounceRefrescarTabla} />
          <ReactToPrint
            trigger={() => (
              <ButtonPrint />
            )}
            content={() => componentRef.current}
          />
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarPedidos ref={componentRef} refrescar={refrescarTabla}
          pedidos={
            inputRef?.current?.value?.length > 0 ? pedidosFiltrados : pedidos
          }
        />
      )}
    </>
  );
};
