import { MagicMotion as Animar } from "react-magic-motion";
import { useState } from 'react'
const ListaVentas = ({ ventas }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cantidadVentas = 12;
  const startIndex = (currentPage - 1) * cantidadVentas;
  const endIndex = startIndex + cantidadVentas;
  const ventasMostrar = ventas.slice(startIndex, endIndex);
  const totalBotones = Math.ceil(ventas.reverse().length / cantidadVentas);
  console.log(ventas)
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
        <tbody>
          <Animar>
            {ventasMostrar?.map((venta) => {
              return (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>
                    {venta.vendedor.nombre} {venta.vendedor.apellido}
                  </td>
                  <td>{new Date(venta.fecha_venta).toLocaleDateString()} </td>
                  <td>{new Date(venta.fecha_venta).toLocaleTimeString()}</td>
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
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros">
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
        {Array.from({ length: totalBotones }, (_, index) => (
          <button
            key={index + 1}
            className={`btn ${currentPage === index + 1 ? "btn-info" : "btn-secondary"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
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
