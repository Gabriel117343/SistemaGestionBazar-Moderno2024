import { useState } from "react";
import { MagicMotion } from "react-magic-motion";
import ContadorAnimado from "../../shared/magic_ui/ContadorAnimado";
import { PaginationButton } from '../../shared/PaginationButton';
import useFiltroDatosMostrar from '../../../hooks/useFiltroDatosMostrar'
export const TablaStocks = ({ listaStocks, proveedorId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  // Se establece la cantidad de productos a mostrar por pagina
  const cantidadStocks = 10;
  // se crea una copia superficial de la lista y se invierte para mostrar los Stocks mas recientes primero
  const stocksMostrar = useFiltroDatosMostrar({ currentPage, datosPorPagina: cantidadStocks, datos: listaStocks.toReversed() });

  return (
    <article>
      <table className="table table-striped table-hover mb-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Codigo</th>
            <th scope="col">Producto</th>

            <th>Precio</th>
            <th>Proveedor</th>
            <th>Descripcion</th>
            <th scope="col" className="text-center">
              Stock Disponible
            </th>
          </tr>
        </thead>
        <tbody>
          {!proveedorId ? (
            <MagicMotion>
              {stocksMostrar?.map((producto, index) => (
                <tr key={producto.id}>
                  <td scope="row">{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.proveedor.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td className="text-center">{producto.stock.cantidad}</td>
                </tr>
              ))}
            </MagicMotion>
          ) : (
            stocksMostrar?.map((producto, index) => (
              <tr key={producto.id}>
                <td scope="row">{(currentPage - 1) * 10 + index + 1}</td>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.proveedor.nombre}</td>
                <td>{producto.descripcion}</td>
                {producto.stock.cantidad === 0 ?(
                  <td className="text-center">{producto.stock.cantidad}</td>
                ) : (
                  <td className="text-center"><ContadorAnimado value={producto.stock.cantidad}/></td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {listaStocks.length === 0 && (
        <h1 className="text-center pt-4">No se han econtrado Productos..</h1>
      )}
      <div className="pagination-buttons mb-3 mt-1 animacion-numeros d-flex gap-1">
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
       
        <PaginationButton
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalDatos={listaStocks.length}
          cantidadPorPagina={cantidadStocks}
        />
      </div>
    </article>
  );
};
const SinStocks = () => {
  return (
    <>
    <table className="table table-striped">
    <thead>
          <tr>
            <th scope="col">#</th>
            <th>Codigo</th>
            <th scope="col">Producto</th>

            <th>Precio</th>
            <th>Proveedor</th>
            <th>Descripcion</th>
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

export const ValidarStocks = ({ listaStocks, proveedorId }) => {
  const validacion = listaStocks.length > 0; // si listaStocks es mayor a 0
  // sera true o false
  // RENDERIZADO CONDICIONAL
  return validacion ? (
    <TablaStocks listaStocks={listaStocks} proveedorId={proveedorId} />
  ) : (
    <SinStocks />
  );
};
