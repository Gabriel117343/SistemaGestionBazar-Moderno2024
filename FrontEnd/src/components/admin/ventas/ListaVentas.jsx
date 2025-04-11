import { useId } from "react";
import { MagicMotion as Animar } from "react-magic-motion";

import calcularContador from "@utils/calcularContador";
import { ItemVenta } from "./ItemVenta";
const ListaVentas = ({ ventas, currentPage, pageSize }) => {
  const id = useId();

  return (
    <section>
      <table
        id={`${id}-tabla-ventas`}
        className="table table-striped table-hover"
      >
        <thead>
          <tr>
            <th>#</th>
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
            {ventas?.map((venta, index) => {
              const contador = calcularContador({
                currentPage,
                pageSize,
                index,
              });
              return (
                <ItemVenta key={venta.id} contador={contador} venta={venta} />
              );
            })}
          </Animar>
        </tbody>
      </table>
    </section>
  );
};
const SinVentas = () => {
  return (
    <section>
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
    </section>
  );
};
export const ValidarVentas = ({ ventas, ...props }) => {
  const hayVentas = ventas.length > 0;
  return hayVentas ? <ListaVentas ventas={ventas} {...props} /> : <SinVentas />;
};
