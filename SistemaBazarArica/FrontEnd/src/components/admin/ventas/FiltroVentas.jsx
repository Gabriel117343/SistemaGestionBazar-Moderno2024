import { useContext, useEffect, useState, useRef } from "react";
import { VentasContext } from "../../../context/VentasContext";
import CargaDeDatos from "../../../views/CargaDeDatos";
import { toast } from "react-hot-toast";
import { debounce } from 'lodash'; 
import { ValidarVentas } from "./ListaVentas";
export const FiltroVentas = () => {
  const {
    stateVenta: { ventas },
    getVentasContext,
  } = useContext(VentasContext);

  const [ventasFiltradas, setVentasFiltradas] = useState(ventas);
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    toast.loading("Cargando ventas...", { id: "loading" });
    const cargarVentas = async () => {
      // se utiliza async/await en lugar de promesas para esperar la respuesta y obtener el mensaje
      // hace el código más limpio, fácil de entender y rápido
      const { success, message } = await getVentasContext();
      if (!success) {
        toast.error(
          message ?? "Ha ocurrido un error inesperado al cargar las ventas", { id: "loading" }
        );
      } else {
        setIsLoading(false);
        toast.success(message ?? "Ventas cargadas correctamente", { id: "loading", duration: 2000 });
      }
    };
    cargarVentas();
  }, []);
  const vendedoresConVentas = ventas?.reduce((acc, venta) => {
    // Asegurarse de que venta.vendedor exista y tenga una propiedad id
    if (venta.vendedor && venta.vendedor.id) {
      // Buscar si el vendedor ya está en el acumulador
      const vendedorExistente = acc.find((v) => v.id === venta.vendedor.id);
      if (!vendedorExistente) {
        // Si no está, añadir el objeto del vendedor al acumulador
        acc.push({
          id: venta.vendedor.id,
          nombre: venta.vendedor.nombre,
          apellido: venta.vendedor.apellido,
        });
      }
    }
    return acc;
  }, []);
 
  const filtroCliente = (filtro) => {
    selectRef.current.value = "all";

    const ventasFiltradas = ventas.filter((venta) =>
      venta.cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) || venta.cliente.apellido.toLowerCase().includes(filtro.toLowerCase()) || venta.cliente.rut.toLowerCase().includes(filtro.toLowerCase())
    );
    
    setVentasFiltradas(ventasFiltradas);
  
  };
  const filtrarPorVendedor = (id) => {
    inputRef.current.value = "";
    console.log(id)
    if (id === "all") {
      setVentasFiltradas(ventas);
      return;
    }
    const ventasFiltradas = ventas.filter((venta) => venta.vendedor.id === parseInt(id));
    setVentasFiltradas(ventasFiltradas);
  }
  const refrescarTabla = async () => {
    const { success, message } = await getVentasContext(ventas);
    if (!success) {
      toast.error(
        message ?? "Ha ocurrido un error inesperado al cargar las ventas"
      );
    } else {
      setIsLoading(false);
      toast.success(message ?? 'Tabla actualizada correctamente');
    }
  };
  const debounceRefrescarTabla = debounce(refrescarTabla, 500);
  const imprimirTabla = () => {
    print();
  };
  const filtroActivo = selectRef.current?.value !== "all" || inputRef.current?.value?.length > 0;
  return (
    <section>
      <div className="d-flex align-items-center mb-2 column">
        <div className="col-md-3 pe-4">
          <label htmlFor="vendedor">Vendedor</label>
          <select ref={selectRef} id="vendedor" className="form-select" onChange={(e) => filtrarPorVendedor(e.target.value)}>
            <option value="all">Todos</option>
            {vendedoresConVentas.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nombre} {vendedor.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-9 d-flex align-items-end gap-1">
          <i className="bi bi-search pe-1 pb-2"></i>
          <div style={{ width: "100%" }}>
            <label htmlFor="nombre">Buscar</label>
            <input
              ref={inputRef}
              type="text"
              id="nombre"
              onChange={(e) => filtroCliente(e.target.value)}
              className="form-control"
              placeholder="Buscar por cliente"
            />
          </div>
          <button className="btn btn-outline-primary" onClick={debounceRefrescarTabla}>
            <i className="bi bi-arrow-repeat"></i>
          </button>
          <button className="btn btn-outline-primary" onClick={imprimirTabla}>
            <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarVentas ventas={filtroActivo ? 
          ventasFiltradas : ventas
        } />
      )}
    </section>
  );
};
