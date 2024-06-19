import React, { useState, useEffect } from 'react'
import { MagicMotion } from 'react-magic-motion'
import { CardImg, Modal} from 'react-bootstrap'
import { FormRegistroCliente } from './FormRegistroCliente'
import { ListaClientes } from './ListaClientes'
import './puntoVenta.css'
export const Carrito = ({ datos, funciones }) => {
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false)
  const [opcionCliente, setOpcionCliente] = useState(true)

  const { agregarProductoCarrito, restarProductoCarrito, vaciarCarrito, realizarVenta } = funciones
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
  return (
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
