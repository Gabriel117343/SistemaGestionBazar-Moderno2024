import React, { useState, useEffect } from 'react'
import { MagicMotion } from 'react-magic-motion'
import { CardImg, Modal} from 'react-bootstrap'
import { FormRegistroCliente } from './FormRegistroCliente'
import { ListaClientes } from './ListaClientes'
import './puntoVenta.css'
import { debounce } from 'lodash'
import Swal from 'sweetalert2'
export const Carrito = ({ datos, funciones }) => {
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false)
  const [opcionCliente, setOpcionCliente] = useState(true)
  console.log('renderizado carrrito')
  const { agregarProducto, restarProductoCarrito, vaciarCarrito, realizarVenta, actualizarCarrito } = funciones
  const { clienteSeleccionado, clientes, carrito } = datos

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
  const validarCarrito = () => {
    const carritoSinCantidad = carrito.some(prod => prod.cantidad === 0 || prod.cantidad === '0' || prod.cantidad === '')
    if (carritoSinCantidad) {
      // sweetalert2
      Swal.fire({
        title: 'Error al realizar la venta',
        text: 'Seleccione la cantidad a vender para cada productof del carrito',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      })
      return
    } else {
      realizarVenta()
    }
  }
  const debounceAgregarProducto = debounce(agregarProducto, 100)
  
  const debounceActualizarCarrito = debounce(actualizarCarrito, 200)
  return (
    <div className="col-md-4">

        <div>
          <MagicMotion className='carrito' name='carrito' duration={0.5}>
            <ul className='ul-carrito ps-1'>
            
            {carrito?.map(producto => (
              <li key={producto.id}>
                
                <div className="d-flex justify-content-between">
                  <div>
                    <CardImg className='img-min-producto' src={producto.imagen} style={{width: '30px', height: '26px'}}/>
                      <strong className='ps-1'>{producto.nombre}</strong>
                      <div className="d-flex flex-column">
                        <div className="d-flex ps-4">
                          <input type="number" className='unidades-producto' defaultValue={producto.cantidad} onChange={e => {
                            if (e.target.value > 99) {
                              e.target.value = e.target.value.slice(0, 2);
                            }
                            debounceActualizarCarrito(producto.id, e.target.value);
                          }} 
                          min='0' 
                          max='99' value= {producto.cantidad}/>
                          <p className='mb-0'>/Unidades en ${producto.cantidad*producto.precio}</p>
                        </div>
                      </div>
                    
                  </div>
                  <div className=''>
                    <strong>${producto.precio}</strong>
                    <div className="d-flex justify-content-end">
                          <button className='boton-restar d-flex align-items-center justify-content-center' onClick={() => restarProductoCarrito(producto.id)}>-</button>
                  
                          <button className='boton-sumar ms-1 d-flex align-items-center justify-content-center' onClick={() => debounceAgregarProducto(producto)}>+</button>

                        </div>
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
          <button disabled={clienteSeleccionado && !opcionCliente && carrito.length > 0 ? false:true} className='btn btn-success form-control mt-2' onClick={validarCarrito}>Pagar</button>

          </MagicMotion>
         
         
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
