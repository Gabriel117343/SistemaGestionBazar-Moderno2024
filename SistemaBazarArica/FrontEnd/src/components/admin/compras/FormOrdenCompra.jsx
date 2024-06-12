import React, { useContext, useState, useEffect, useRef } from 'react'
import { PedidosContext } from '../../../context/PedidosContext'
import { ProductosContext } from '../../../context/ProductosContext'
import { ProveedoresContext } from '../../../context/ProveedoresContext'
import { ProductosPedidosContext } from '../../../context/ProductosPedidosContext'
import { debounce, max, set } from 'lodash'
import { toast } from 'react-hot-toast'
import swal from 'sweetalert2'
import './compras.css'
export const FormOrdenCompra = ({ volver }) => {

  const { statePedido: { pedidos }, getPedidosContext, crearPedidoContext } = useContext(PedidosContext)
  const { stateProducto: { productos }, getProductosContext } = useContext(ProductosContext)
  const { stateProveedor: { proveedores }, getProveedoresContext } = useContext(ProveedoresContext)
  const { productosPedidosState: { listaPedidos }, getAllProductosPedidosContext, crearProductoPedidoContext } = useContext(ProductosPedidosContext)

  const [productosDeProveedor, setProductosDeProveedor] = useState([]) // Nuevo estado para los productos del proveedor
  const [productosAgregados, setProductosAgregados] = useState([]) // Nuevo estado para los productos agregados a la orden de compra
  const [subtotal, setSubtotal] = useState(0)
  const [descuento, setDescuento] = useState(0)
  const [impuesto, setImpuesto] = useState(0)
  const [total, setTotal] = useState(0)
  const [ordenFinalizada, setOrdenFinalizada] = useState(false)

  const [codigoPedido, setCodigoPedido] = useState('')
  const productoRef = useRef() // se usara para limpiar el input de producto
  const cantidadRef = useRef() // se usara para limpiar el input de cantidad

  useEffect(() => {
    const cargar = () => {
      getPedidosContext() // se ejecuta la funcion getProductos del contexto de los productos
      getProductosContext()
      getProveedoresContext()
      getAllProductosPedidosContext()
     
    }
    cargar()
  }, [])
  useEffect(()=> {
   
   function calcularCodigo () {
    let codigoInicial = 'PO-0001' // codigo por defecto
    const maximo = pedidos.reduce((acc, pedido) => {
      let numero = parseInt(pedido.codigo.replace('PO-', ''))
      return numero > acc ? numero : acc
    }, 0)
  
    codigoInicial = (maximo + 1).toString().padStart(4, '0') // deben ver 4 digitos en el codigo, se rellena con 0 si es necesario

    setCodigoPedido(`PO-${codigoInicial}`) // se une el array para formar el nuevo codigo
   }
   calcularCodigo()
    
  }, [])
  useEffect(() => {
     function calcularSubtotal() {
      const sub = productosAgregados.map(producto => producto.subtotal) // se crea un array con los subtotales de cada producto
      const subtotal = sub.reduce((a, b) => a + b, 0) // se suman los subtotales del array
      setSubtotal(subtotal)
    }
    calcularSubtotal()

  }, [productosAgregados]) // cada vez que se agregue un producto se ejecuta el useEffect
  // useEffect para calcular el total de la orden de compra
  useEffect(() => {
    const calcularTotal = () => {
      const total = subtotal - descuento + impuesto
      setTotal(total)
    }
    calcularTotal()
  }, [subtotal, descuento, impuesto, productosAgregados])

  const encontrarProductosDeProveedor = (e) => {

    const id = e.target.value
    const idInt = parseInt(id) // se convierte el id a entero para poder compararlo con el id del proveedor

    const productosDelProveedor = productos.filter(producto => producto.proveedor.id === idInt)
    setProductosDeProveedor(productosDelProveedor)
    console.log(productosDelProveedor)
  }
  const agregarProducto = (event) => {
    event.preventDefault()
    const datosOrden = Object.fromEntries(new FormData(event.target))
    if (datosOrden.producto === '' || datosOrden.cantidad === '' || datosOrden.proveedor === '') {

      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No puede dejar campos vacios'
      })
    }
    else {
      const producto = productosDeProveedor.find(producto => producto.id === parseInt(datosOrden.producto))
      const productoAgregado = {
        cantidad: parseInt(datosOrden.cantidad),
        producto: producto,
        precioUnitario: producto.precio,
        subtotal: producto.precio * parseInt(datosOrden.cantidad)
      }
      setProductosAgregados([...productosAgregados, productoAgregado])

      console.log(productosAgregados)
      productoRef.current.value = ''
      cantidadRef.current.value = '' // limpiando los inputs de producto y cantidad
      toast.success('Producto agregado correctamente')
    }
  }
  const calcularDescuento = (event) => {
    const descuento = event.target.value
    const descuentoInt = parseInt(descuento)
    if (descuentoInt > 100) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El descuento no puede ser mayor a 100'
      })
    } else if(descuentoInt < 0) {
      
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El descuento no puede ser menor a 0'
      })
      
    }
    if (descuentoInt === 0 || descuentoInt === '' || descuentoInt === NaN) {
      setDescuento(0)
    }
    const descuentoTotal = (descuentoInt * subtotal) / 100
    setDescuento(descuentoTotal)
  }
  const calcularImpuesto = (event) => {
    if (event.target.value > 100) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El impuesto no puede ser mayor a 100'
      })
    } else if (event.target.value < 0) {
     
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El impuesto no puede ser menor a 0'
      })
      
    }
    if (event.target.value === 0 || event.target.value === '' || event.target.value === NaN) {
      setImpuesto(0)
    }
    const impuesto = event.target.value
    const impuestoInt = parseInt(impuesto) // transforma a entero el impuesto
    const impuestoTotal = (impuestoInt * subtotal) / 100 // calcula el impuesto
    
    setImpuesto(impuestoTotal) // setea el impuesto
  }
  const crearPedido = async (event) => {
    event.preventDefault()
    const datosOrden = Object.fromEntries(new FormData(event.target))
    if (datosOrden.observacion === '') {
      datosOrden.observacion = 'Sin observaciones' // si no se agrega una observacion se agrega un texto por defecto
    }

    const formPedido = new FormData()
    formPedido.append('codigo', codigoPedido) // se agrega el codigo generado en el useEffect al form
    // codigo del proveedor atravez del primero producto de la lista de productos agregados
    formPedido.append('proveedor', productosAgregados[0].producto.proveedor.id)

    // se puede agregar un objeto al form con append, estos seran los productos del pedido
    formPedido.append('total', total)
    formPedido.append('observacion', datosOrden.observacion)

    const { success, message, pedidoId } = await crearPedidoContext(formPedido)
    console.log(pedidoId)
    if (success) {
      swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        text: message
      })
      console.log(productosAgregados)
      // Crear un nuevo FormData para los productos del pedido
      for (let productoAgregado of productosAgregados) {
        // Crear un nuevo FormData para el producto del pedido
        const formProductoPedido = new FormData()
        formProductoPedido.append('producto', productoAgregado.producto.id)
        formProductoPedido.append('cantidad', productoAgregado.cantidad)
        
        formProductoPedido.append('precio', productoAgregado.subtotal)
        formProductoPedido.append('pedido', pedidoId)
        const mostrarForm  = Object.fromEntries(formProductoPedido)
        console.log(mostrarForm)
        // Enviar el FormData con el producto del pedido
        const { success, message } = await crearProductoPedidoContext(formProductoPedido)
        if (!success) {
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
          })
          break
        }
      }
    
      swal.fire({
        icon: 'success',
        title: 'Productos agregados',
        text: 'Todos los productos fueron agregados al pedido'
      })
      setOrdenFinalizada(true)
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      })
    }

  }
  
  const imprimir = () => {
    print()
  }
  // Formulario de Orden de compra
  return (
    <section style={{borderTop: '3px solid #3085d6', borderBottom: '3px solid #3085d6'}} className='rounded py-2 px-3 bg-white'>
      {ordenFinalizada ? 
      (
        <h3 className="text-center">Orden de Compra para {productosAgregados[0]?.producto.proveedor.nombre}</h3>
      )
      :
      (
        <form action="" onSubmit={agregarProducto}>
          <div  style={{borderBottom: '2px solid #0011 '}}>
            <h3>Crear Nueva Orden de Compra</h3>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label  htmlFor="codigo" className='colorLabel'>Código</label>
                <input  type="text" className="form-control fondoSelect" name="codigo" id="codigo" defaultValue={codigoPedido} readOnly />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">

                <label htmlFor="proveedor" className='colorLabel'>Proveedor</label>
          
                <select disabled={productosAgregados.length === 0 ? false:true}  className="form-control fondoSelect" name="proveedor" id="proveedor" onChange={encontrarProductosDeProveedor}>
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                    <option onChange={() => encontrarProductosDeProveedor(proveedor.id)} value={proveedor.id} key={proveedor.id}>{proveedor.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row mt-2">
          <h3 className='colorLabel'>Producto</h3>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="producto" className='labe'>Producto</label>
                <select ref={productoRef} className="form-control fondoSelect" name="producto" id="producto">
                  {productosDeProveedor.length === 0 ? <option value="" disabled={true}>Seleccione un proveedor Primero</option> : <option value="">Seleccione un producto</option>}
                  {productosDeProveedor.map(producto => (
                    <option value={producto.id} key={producto.id}>{producto.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="cantidad">Cantidad</label>
                <input ref={cantidadRef} type="number" className="form-control fondoSelect" name="cantidad" id="cantidad" placeholder='Ingrese la cantidad' />
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-center align-items-center gap-5 pt-3">
              <button className='btn btn-primary' type='submit'>Agregar</button>
              <button className='btn btn-danger' type='button' onClick={() => volver()}>Cancelar</button>
            </div>
          </div>

        </form>

      )
      }
      
      
      <br />
      <form action="" onSubmit={crearPedido}>
        <table className='table'>
          <thead className=' table table-dark text-white'>
            <tr>
              <th></th>
              <th>Cantidad</th>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productosAgregados.length === 0 ? <tr><td colSpan='5' className='text-center'><div className='alert alert-warning m-0 p-0'>No hay productos agregados</div></td></tr> : null}
            {productosAgregados.map((producto, index) => (
              <tr key={index}>
                <td className='p-0'><button className='btn' onClick={() => setProductosAgregados(productosAgregados.filter(productoAgregado => productoAgregado.producto.id !== producto.producto.id))}><i class="bi bi-x-square text-danger" style={{fontSize: '25px'}}></i></button></td>
                <td>{producto.cantidad}</td>
                <td>{producto.producto.nombre}</td>
                <td>${producto.precioUnitario}</td>
                <td>${producto.subtotal}</td>
              </tr>
            ))}

            <tr>
        
              <td></td>
              <td></td>
              <td></td>
              <td>Subtotal</td>
              <td>${subtotal}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Descuento <input onChange={calcularDescuento}  style={{maxWidth:'40px'}} placeholder='0' type="number" defaultValue={0} /> %</td>
              <td>{descuento}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Impuesto <input className='p-0 ms-2' onChange={calcularImpuesto} style={{maxWidth:'40px'}} placeholder='0' defaultValue={0} type="number" /> %</td>
              <td>{impuesto}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td><p className='p-0 m-0' style={{fontWeight: 'bold'}}>Total</p></td>
              <td>{total}</td>
            </tr>
            
          </tbody>
        </table>
        <div className="row gap-3">
          <div className="col-md-6 row">
            <label htmlFor="observacion" className='colorLabel'>Observaciones</label>
            <textarea name="observacion" id="observacion" cols="30" rows="3"></textarea>

          </div>
          <div className="col-md-6 d-flex align-items-end">
            {ordenFinalizada ?
            (
              <>
              <div className="row">
                <div className="alert alert-success p-1">Orden Finalizada</div>
                <div className="d-flex gap-2">
                  <button className='btn btn-success' onClick={() => volver()}>Volver</button>
                  <button className='btn btn-primary' type='button' onClick={imprimir}>Imprimir</button>
                </div>
                
              </div>
                
              </>
            ):
            (
              <button className='btn btn-primary' disabled={productosAgregados.length === 0 ? true:false}>Guardar</button>
            )
             
            }
            
          </div>
          
        </div>
          
      </form>
     
      
    </section>
  )
}
