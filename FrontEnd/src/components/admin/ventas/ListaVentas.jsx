import { MagicMotion as Animar } from "react-magic-motion";
import { useState } from 'react'
import { PaginationButton } from '../../shared/PaginationButton';
import useFiltroDatosMostrar from '../../../hooks/useFiltroDatosMostrar'
const ListaVentas = ({ ventas }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const cantidadVentas = 12;

  const ventasMostrar = useFiltroDatosMostrar({ currentPage, datosPorPagina: cantidadVentas, datos: ventas.toReversed() });
  return (
    <article>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Venta ID</th>
            <th>Vendedor</th>
            <th >Fecha de Venta</th>
            <th >Hora</th>
            <th>Cliente</th>
            <th>Rut</th>
            <th>Teléfono</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <Animar>
            {ventasMostrar?.map((venta, index) => {
              return (
                <tr key={venta.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{venta.id}</td>
                  <td>
                    {venta.vendedor.nombre} {venta.vendedor.apellido}
                  </td>
                  <td >{new Date(venta.fecha_venta).toLocaleDateString()} </td>
                  <td ><i className="bi bi-clock-history"></i> {`${new Date(venta.fecha_venta).toLocaleTimeString()}`}</td>
                  <td>
                    {venta.cliente.nombre} {venta.cliente.apellido}
                  </td>
                  <td>{venta.cliente.rut}</td>
                  <td>{venta.cliente.telefono}</td>
                  <td>{venta.total}</td>
                </tr>
              );
            })}
          </Animar>
        </tbody>
      </table>
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros d-flex gap-1">
       
        <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalDatos={ventas.length} cantidadPorPagina={cantidadVentas} />
      </div>
    </article>
  );
};
const SinVentas = () => {
  return (
    <article>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Venta ID</th>
            <th>Vendedor</th>
            <th>Fecha de Venta</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Rut</th>
            <th>Teléfono</th>
            <th>Total</th>
          </tr>
        </thead>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        No se han encontrado Ventas
      </div>
    </article>
  );
};
export const ValidarVentas = ({ ventas }) => {
  const hayVentas = ventas.length > 0;
  return hayVentas ? <ListaVentas ventas={ventas} /> : <SinVentas />;
};
