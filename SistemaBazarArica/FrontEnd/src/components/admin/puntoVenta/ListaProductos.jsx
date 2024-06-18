
import './puntoventa.css'
import React, { useContext, useEffect, useState } from 'react'
import { StocksContext } from '../../../context/StocksContext'
import { VentasContext } from '../../../context/VentasContext' // contexto de ventas
import { ClientesContext } from '../../../context/ClientesContext'
import { SeccionesContext } from '../../../context/SeccionesContext'
import { SidebarContext } from '../../../context/SidebarContext'
import { CarritoContext } from '../../../context/CarritoContext'
import { MagicMotion } from 'react-magic-motion'
import { CardImg, Modal} from 'react-bootstrap'
import { FormRegistroCliente } from './FormRegistroCliente'
import { ListaClientes } from './ListaClientes'
import { toast } from 'react-hot-toast'
import { debounce } from 'lodash'
import swal from 'sweetalert2'
import useCarrito from '../../../hooks/useCarrito'
import { withLoadingImage } from '../../../hocs/withLoadingImage'


const ListaProductos = ({ listaProductos }) => {
  // Para la modal de edicion
  const { createVentaContext } = useContext(VentasContext)
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false)
  // Contextos
  
  const { stateCliente: { clientes, clienteSeleccionado }, getClientesContext} = useContext(ClientesContext)
  const { stateStock: { stocks }, getStocksContext } = useContext(StocksContext)
  const { stateSeccion: { secciones }, getSeccionesContext } = useContext(SeccionesContext)
  // Cotexto para saber si el sidebar esta abierto o cerrado
  const { sidebar } = useContext(SidebarContext)
  const { carrito, agregarProductoCarrito, eliminarProductoCarrito, restarProductoCarrito, vaciarCarrito } = useContext(CarritoContext)
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos)
  // const [carrito, setCarrito] = useState([])
  const [opcionCliente, setOpcionCliente] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const { obtenerInfoVentaTipo, obtenerInfoVentaProducto } = useCarrito()
  
  useEffect(() => {
    // se ejecuta la funcion cargar al renderizar el componente
    const cargar = async () => {
      getStocksContext()
      getClientesContext()
      getSeccionesContext()
    }
    cargar()
    
  }, [])

  
  const filtroTipo = (event) => {
    const tipo = event.target.value
    if (tipo === 'all') {
      setProductosFiltrados(listaProductos)
      return
    }
    const productosFilt = listaProductos.filter(producto => producto.tipo === tipo)
    setProductosFiltrados(productosFilt)
  }
  const filtroNombre = (event) => {
    const nombre = event.target.value
    
    const productosFilt = listaProductos.filter(producto => producto.nombre.toLowerCase().includes(nombre.toLowerCase()))
    console.log(productosFilt)
    setProductosFiltrados(productosFilt)
  }
  
  const debounceFiltroNombre = debounce(filtroNombre, 300) // se le pasa la funcion y el tiempo de espera
  const filtrarPorSeccion = (id) => {
    const productosFiltrados = listaProductos.filter(producto => producto.seccion.id === id)
    
    setProductosFiltrados(productosFiltrados)
  }

  const realizarVenta = async () => {
    console.log(carrito)
    console.log(clienteSeleccionado)
    const formVenta = new FormData()
    formVenta.append('cliente', clienteSeleccionado.id)
    formVenta.append('total', carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)) // total de la venta
    
    const infoVentaPorTipo = obtenerInfoVentaTipo()

    console.log(infoVentaPorTipo)
    const infoVentaPorProducto = obtenerInfoVentaProducto()
    console.log(infoVentaPorProducto)
    // antes de enviar se convierte a JSON para que el backend pueda leerlo
    formVenta.append('info_venta_tipo',JSON.stringify(infoVentaPorTipo))
    formVenta.append('info_venta_producto_id', JSON.stringify(infoVentaPorProducto))
   
    // agregar productos

    const { success, message } = await createVentaContext(formVenta)

    if (success) {
      vaciarCarrito()
      swal.fire({           
        title: 'Venta realizada',           
        text: message,            
        icon: 'success',            
        confirmButtonText: 'Aceptar',           
        confirmButtonColor: '#3085d6',            
      })
      
    } else {
      swal.fire({
        title: 'Error al realizar la venta',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      
      })
    }
    setOpcionCliente(true) // se vuelve a habilitar la opcion de seleccionar cliente
  }
  useEffect(() => {
    // si no hay productos en el carrito o no hay un cliente seleccionado, se habilita la opcion de seleccionar cliente
    if ((carrito.length === 0 && !opcionCliente) || !clienteSeleccionado) {
      
      setOpcionCliente(true)
    } else {
    
      setOpcionCliente(false)
    }
    // cuando cambie el cliente seleccionado, se habilita la opcion de seleccionar cliente
  }, [clienteSeleccionado])
  const ajustarOpciones = () => {
    setOpcionCliente(true)
    
  }
 
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
    <div className="row">
      
      <div className="col-md-4 pt-2">

        <div>
          <MagicMotion className='carrito' name='carrito' duration={0.5}>
            <ul className='ul-carrito ps-2'>
            
            {carrito?.map(producto => (
              <li key={producto.id}>
                
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{producto.nombre}</strong>
                    <div className="d-flex flex-column">
                      <p className='ps-4 mb-0'><strong>{producto.cantidad}</strong>/Unidades en ${producto.cantidad*producto.precio}</p>
                      <div className="d-flex">
                        <button className='boton-restar d-flex align-items-center justify-content-center' onClick={() => restarProductoCarrito(producto.id)}>-</button>
                
                        <button className='boton-sumar ms-1 d-flex align-items-center justify-content-center' onClick={() => agregarProductoCarrito(producto, stocks)}>+</button>

                      </div>
                      
                      
                    </div>
                    
                  </div>
                  <div>
                    <strong>${producto.precio}</strong>
                  </div>
                </div>
              </li>
            ))}
            {carrito?.length === 0 && <div className='text-center' style={{fontSize: '150px'}}><i className="bi bi-cart-x"></i></div>}
            </ul>
            <hr className='linea-carrito'/>
            <div className="d-flex justify-content-between gap-2 px-1">
            <button className='btn btn-info form-control' disabled={carrito.length > 0 ? false:true} onClick={() => {alert('Proximamente!')}}>Cupon</button>
            <button className='btn btn-danger form-control'disabled={carrito.length > 0 ? false:true}  onClick={vaciarCarrito}>Cancelar</button>
          </div>
          {clienteSeleccionado && !opcionCliente ? (
            <button className='d-flex align-items-center gap-2 pt-1 px-1 button-especial' >
              <i className="bi bi-person-circle" style={{fontSize: '40px'}} onClick={() => ajustarOpciones()}></i>
              <p className='text-center m-0'>{clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}</p>
            </button>
          )
          :
          (
            <div className='d-flex align-items-center gap-3 pt-1 px-1'>
              <i className="bi bi-person-circle" style={{fontSize: '40px'}}></i>
              <button className='btn border ' onClick={() => setShowModal(true)}>Agregar Cliente</button>
              <button className='btn border' onClick={() => setShowListModal(true)}>Seleccionar Cliente</button>
            </div>

          )
        }
          <div className="d-flex justify-content-between gap-2 pt-2 px-2">
            <strong>Total</strong>
            <strong>$ {carrito?.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)}</strong>
          </div>
          <button disabled={clienteSeleccionado && !opcionCliente && carrito.length > 0 ? false:true} className='btn btn-success form-control mt-2' onClick={realizarVenta}>Pagar</button>

          </MagicMotion>
         
         
        </div>
      </div>
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
          
          <button onClick={() => setProductosFiltrados(listaProductos)} className={`border rounded btn-seleccion ${productosFiltrados.length === listaProductos.length ? 'btn-filtro': ''}`}>Todos</button>
          
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
              const stock = stocks.find(stock => stock.producto.id === id)
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
                      <button className="btn btn-warning form-control" onClick={() => agregarProductoCarrito(producto, stocks)}>Agregar</button>
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRegistroCliente cerrarModal={() => setShowModal(false)}/>
        </Modal.Body>
      </Modal>
      
      <Modal show={showListModal} onHide={() => setShowListModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar Cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListaClientes clientes={clientes} cerrarModal={() => setShowListModal(false)}/>
          </Modal.Body>
      </Modal>
    </div>
  )
}
const SinProductos = () => {
  return (
    <div className="alert alert-danger" role="alert">
      No hay productos en la lista
    </div>
  )

}

export const ValidarProductos = ({ listaProductos }) => {
  
  const validacion = listaProductos.length > 0
  // RENDERIZADO CONDICIONAL, la validacion es true o false
  return (
    <>
      {validacion ?
        <ListaProductos listaProductos={listaProductos} />
        :
        <SinProductos />
      }
    </>
  )
}
// const ImageWithLoading = withLoadingImage((img) => (

//   <img loading='lazy' width='100%' height='150px' url={img} alt="Imagen del producto" />
// ));