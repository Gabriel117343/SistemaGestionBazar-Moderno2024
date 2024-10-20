import { MagicMotion } from "react-magic-motion";
import { useId } from 'react'
import ContadorAnimado from "../../shared/magic_ui/ContadorAnimado";
import calcularContador from '@utils/calcularContador'

export const TablaStocks = ({
  listaStocks,
  proveedorId,
  currentPage,
  pageSize,
}) => {

  const id = useId()

  return (
    <section>
      <table id={`tabla-stock-${id}`} className="table table-striped table-hover mb-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Código</th>
            <th scope="col">Producto</th>
            <th>Proveedor</th>
            <th>Sección</th>
            <th scope="col" className="text-center">
              Stock Disponible
            </th>
          </tr>
        </thead>
        <tbody>
          {!proveedorId ? (
            // es necesario que se ejecute una animación u otra, pero no ambas al mismo tiempo porque causaría un error en la librería de animación de react-magic-motion
            <MagicMotion>
              {listaStocks?.map((stock, index) => {
                const contador = calcularContador({ index, pageSize, currentPage });
                return (
                  <tr key={stock.id}>
                    <td scope="row">{contador}</td>
                    <td>{stock.producto.codigo}</td>
                    <td>{stock.producto.nombre}</td>
                    <td>{stock.producto.proveedor.nombre}</td>
                    <td>{stock.producto.seccion.nombre}</td>
                    <td className="text-center">{stock.cantidad}</td>
                  </tr>
                );
              })}
            </MagicMotion>
          ) : (
            listaStocks?.map((stock, index) => {
              const contador = calcularContador(index);
              return (
                <tr key={stock.id}>
                  <td scope="row">{contador}</td>
                  <td>{stock.producto.codigo}</td>
                  <td>{stock.producto.nombre}</td>
                  <td>{stock.producto.proveedor.nombre}</td>
                  <td>{stock.producto.seccion.nombre}</td>
                  {stock.cantidad === 0 ? (
                    <td className="text-center">{stock.cantidad}</td>
                  ) : (
                    <td className="text-center">
                      <ContadorAnimado value={stock.cantidad} />
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {listaStocks.length === 0 && (
        <h1 className="text-center pt-4">No se han econtrado Productos..</h1>
      )}
    
    </section>
  );
};
const SinStocks = () => {
  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Código</th>
            <th scope="col">Producto</th>

            <th>Precio</th>
            <th>Proveedor</th>
            <th>Descripción</th>
            <th scope="col" className="text-center">
              Stock Disponible
            </th>
          </tr>
        </thead>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">No se han Stocks de Productos</h5>
      </div>
    </>
  );
};

export const ValidarStocks = ({ listaStocks, ...props }) => {
  const validacion = listaStocks.length > 0; // si listaStocks es mayor a 0
  // sera true o false
  // RENDERIZADO CONDICIONAL
  return validacion ? (
    <TablaStocks listaStocks={listaStocks} {...props} />
  ) : (
    <SinStocks />
  );
};
