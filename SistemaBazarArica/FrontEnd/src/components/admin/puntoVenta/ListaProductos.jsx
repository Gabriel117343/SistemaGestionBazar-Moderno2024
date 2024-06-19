
import './puntoventa.css'
import React, { useContext, useEffect, useState } from 'react'

import { SidebarContext } from '../../../context/SidebarContext'

import { MagicMotion } from 'react-magic-motion'

import { toast } from 'react-hot-toast'
import { debounce } from 'lodash'

import { withLoadingImage } from '../../../hocs/withLoadingImage'
const ListaProductos = ({ datos, funciones }) => {
  const { productosFiltrados, stocks, secciones, productos, carrito } = datos
  const { debounceFiltroNombre, filtrarPorSeccion, filtroTipo, resetearProductosFiltrados, agregarProducto } = funciones
  
  // Contextos
 
  // Contexto para saber si el sidebar esta abierto o cerrado
  const { sidebar } = useContext(SidebarContext)
  
  // Separar en Hooks
  const [currentPage, setCurrentPage] = useState(1)
  function calculoPaginas () {
    // se define la cantidad de productos por pagina dependiendo si esta en es md o lg
    // si el sidebar esta abierto o cerrado y si esta en una resolucion de 1700px o 1900pxs
    let productosPorPagina = 0
    if (window.innerWidth < 1700) {
      productosPorPagina = 8
    } else if ((window.innerWidth > 1700 || window.innerWidth < 1900) && sidebar) {
      console.log(sidebar)
      productosPorPagina = 10
    } else if ( window.innerWidth > 1900 || !sidebar) {
      productosPorPagina = 12
    } else {
      productosPorPagina = 8
    }
    return productosPorPagina

  }
  
  useEffect(() => {
 
    calculoPaginas()
    

  }, [sidebar]) // se ejecuta cuando cambie el sidebar
  // se calcula la cantidad de productos por pagina
  const cantidadPorPagina = calculoPaginas()
  console.log(`--Se mostraran ${cantidadPorPagina} productos por pagina--`)
  // calculando el índice y fin de la lista actual en función de la página actual y los elementos por página
  const startIndex = (currentPage - 1) * cantidadPorPagina
  const endIndex = startIndex + cantidadPorPagina
  // Obtengo los elementos a mostrar en la página actual, slice filtrara el inicio a fin
  const productosMostrar = productosFiltrados.slice(startIndex, endIndex)
  // Servira para calcular el número total de páginas en función de la cantidad total de elementos y los elementos por página ej: el boton 1, 2, 3 etc..
  const totalBotones = Math.ceil(productosFiltrados.length / cantidadPorPagina)

  return (
    <>
      <div className="col-md-8">
        <div className="row pb-1">
          <div className="col-md-6">
            <label htmlFor="">Filtrar por tipo</label>
            <select className='form-control' name="tipo" id="" onChange={filtroTipo}>
                <option value="all">Todas</option>
                <option value="bebidas">Bebidas</option>
                <option value="carnes">Carnes</option>
                <option value="lacteos">Lacteos</option>
                <option value="pastas">Pastas</option>
                <option value="snacks">Snacks</option>
                <option value="aseo">Aseo</option>
                <option value="otros">Otros</option>
              </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="">Buscar</label>
            <input type="text" className="form-control" placeholder="Ej: Arroz Miraflores" onChange={debounceFiltroNombre}/>
            
          </div>
        </div>
        
        
        <div className="pb-1 d-flex gap-1 contenedor-secciones">
          
          <button onClick={() => resetearProductosFiltrados(productos)} className={`border rounded btn-seleccion ${productosFiltrados.length === productos.length ? 'btn-filtro': ''}`}>Todos</button>
          
          {secciones?.map(seccion => (
            <div key={seccion.id} className="seccion">
              <button onClick={() => filtrarPorSeccion(seccion.id)} className={`border rounded btn-seleccion ${productosFiltrados.some(producto => producto.seccion.numero === seccion.numero) ? 'btn-filtro': ''}`}>{seccion.nombre}</button>
            </div>
          
          ))}

        </div>
        <ul className='productos productos-contendor'>
          <MagicMotion className='row' name='productos' duration={0.5}>
            {productosMostrar?.map(producto => {
              
              const { id, nombre, precio, imagen } = producto // destructuracion de producto
              const stock = stocks?.find(stock => stock.producto.id === id)
              const cantidad = stock ? stock.cantidad : 0
              const stockProductoCarrito = carrito.find(prod => prod.id === id)?.cantidad || 0 // se accede a la cantidad/stock del producto en el carrito
      
              const cantidadCalculada = cantidad - stockProductoCarrito
              
              // lo que hace cantidadCalculada es restar la cantidad de productos que ya estan en el carrito para que no se pueda agregar mas de lo que hay en stock
              // solo es una forma de representar la cantidad de productos que se pueden agregar, pero no es la cantidad real que viene del stock del backend
              
       
              // const ImageWithLoading = withLoadingImage((props) => <img {...props} />);
              return (
                <li key={id} className='producto'>
                  <div className="producto">
                    <div className='pt-0'>
                      {imagen ?
                      (
                
                          <img  width='100%' height='150px' src={imagen} alt={`esto es una imagen de un ${nombre}`} />
                      ) 
                      :
                      (
                          <img  width='100%' height='150px' src='https://ww.idelcosa.com/img/default.jpg' alt="esta es una imagen por defecto" />
                      ) }
                   
                      {/* {imagen 
                        ? <ImageWithLoading loading='lazy'  width='100%' height='150px' src={imagen} alt={`esto es una imagen de un ${nombre}`} />
                        : <ImageWithLoading effect="blur" width='100%' height='150px' src='https://ww.idelcosa.com/img/default.jpg' alt="esta es una imagen por defecto" />
                      } */}
                    </div>
                    
                    <div className="p-0 m-0">
                      <p className="producto__nombre p-0 m-0">{nombre}</p>
                      <div className="d-flex justify-content-center">
                        <p className="p-0 m-0 text-success precio-num">${precio}</p>
                        <p className="p-0 m-0 ps-2 stock-num d-flex align-items-center"> Stock: {cantidadCalculada}</p>
                          
                      </div>
                      
                    </div>
                    <div className='pt-0 mt-0'>
                      <button className="btn btn-warning form-control" onClick={() => agregarProducto(producto)}>Agregar</button>
                    </div>
                    
                  </div>
                  
                </li>
                
              )
            }  )}
          </MagicMotion>
          {productosFiltrados.length === 0 && <h1 className='text-center pt-4'>No se han econtrado Productos..</h1>}
          

        </ul>
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
        <div className='pt-1'>
           {Array.from({ length: totalBotones }, (_, index) => (
          <button key={index + 1} className={`btn ${currentPage === index + 1 ? 'btn-info' : 'btn-secondary'}`} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
          
        </div>
        
       
        
      </div>
      
    </>
  )
}
const SinProductos = () => {
  return (
    <div className="col-md-8">
      <div className="alert alert-danger" role="alert">
      No hay productos en la lista
    </div>
    </div>
    
  )

}

export const ValidarProductos = ({ datos, funciones }) => {
  const { productos } = datos
  const validacion = productos?.length > 0
  // RENDERIZADO CONDICIONAL, la validacion es true o false

  return (
    <>
      {validacion ?
        <ListaProductos datos={{...datos}} funciones={{...funciones}}/>
        :
        <SinProductos />
      }
    </>
  )
}
// const ImageWithLoading = withLoadingImage((img) => (

//   <img loading='lazy' width='100%' height='150px' url={img} alt="Imagen del producto" />
// ));