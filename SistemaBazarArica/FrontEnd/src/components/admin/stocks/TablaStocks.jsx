import React, { useState } from 'react'
import { MagicMotion } from 'react-magic-motion'
export const TablaStocks = ({ listaStocks, filtrar, imprimir, refrescar }) => {

  const [currentPage, setCurrentPage] = useState(1)
  // Se establece la cantidad de productos a mostrar por pagina
  const cantidadStocks = 10
  // Calculando el índice de inicio y fin de la lista actual en función de la página actual y los elementos por página
  const startIndex = (currentPage - 1) * cantidadStocks
  const endIndex = startIndex + cantidadStocks
  // Obtener los elementos a mostrar en la página actual, slice filtrara el inicio a fin
  const stocksMostrar = listaStocks.slice(startIndex, endIndex)
  // para calcular el numero total de paginas en funcion de la cantidad total de elementos y los elementos por pagina ej: el boton 1, 2, 3 etc..
  const totalBotones = Math.ceil(listaStocks.reverse().length / cantidadStocks)// reverse para que la tabla muestre desde el ultimo usuario creado al primero
  let contador = startIndex + 1 // para numerar los usuarios en la tabla comenzando por el starIndex aumentado en uno
  return (
    <section>
      <div className='d-flex gap-2 align-items-center pb-2'>
        <i className='bi bi-search'></i>
        <input className='form-control' type="text" placeholder="Buscar por nombre, proveedor o codigo" onChange={e => filtrar(e.target.value)}/>
        <button className='btn btn-outline-primary' onClick={refrescar}><i className="bi bi-arrow-repeat"></i></button>
        <button className='btn btn-outline-primary' onClick={imprimir}><i class="bi bi-printer"></i></button>

      </div>
      
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th>Codigo</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Descripcion</th>
            <th scope="col" className='text-center'>Stock Disponible</th>
          </tr>
        </thead>
        <tbody>
          <MagicMotion>
            {
              stocksMostrar?.map((producto) => (
                <tr key={producto.id}>
                  <th scope="row">{contador++}</th>
                  <td>{producto.nombre}</td>
                  <td>{producto.codigo}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.proveedor.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td className='text-center'>{producto.stock.cantidad}</td>
      
                </tr>
              ))
            }

          </MagicMotion>
        </tbody>
      </table>
      {listaStocks.length === 0 && <h1 className='text-center pt-4'>No se han econtrado Productos..</h1>}
      <div className='pagination-buttons mb-3 mt-1 animacion-numeros'>
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
        {Array.from({ length: totalBotones }, (_, index) => (
          <button key={index + 1} className={`btn ${currentPage === index + 1 ? 'btn-info' : 'btn-secondary'}`} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}
const SinStocks = () => {
  return (
    <>
     
      <div className='d-flex gap-2 align-items-center pb-2'>
          <i className='bi bi-search'></i>
          <input className='form-control' type="text" placeholder="Buscar por nombre, proveedor, descripcion, stock..." />
          <button className='btn btn-outline-primary' ><i className="bi bi-arrow-repeat"></i></button>
          <button className='btn btn-outline-primary' ><i class="bi bi-printer"></i></button>

        </div>
      <section>
        <table className="table table-striped mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Producto</th>
              <th>Codigo</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Descripcion</th>
              <th scope="col" className='text-center'>Stock Disponible</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">-</th>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <h1 className='text-center pt-5'>No Hay Productos Registrados</h1>
      </section>
    </>
    
  )
}


export const ValidarStocks = ({ productos, listaStocks, filtrar, imprimir, refrescar}) => {
  const validacion = productos.length > 0 // si listaStocks es mayor a 0
  // sera true o false
  // RENDERIZADO CONDICIONAL
  return (
    validacion
      ? <TablaStocks listaStocks={listaStocks} filtrar={filtrar} imprimir={imprimir} refrescar={refrescar}/>
      : <SinStocks />
  )
}