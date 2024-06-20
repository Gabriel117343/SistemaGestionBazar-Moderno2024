import { useContext, useState, useEffect } from 'react'
import { ProductosContext } from '../../../context/ProductosContext'
import { ValidarStocks } from './TablaStocks'
import { toast } from 'react-hot-toast'
import { debounce } from 'lodash'
export const StockSmart = () => {

  const { stateProducto: { productos }, getProductosContext } = useContext(ProductosContext)
  const [stockFiltrado, setStockFiltrado] = useState(productos) // Nuevo estado para el input de busqueda

  useEffect(() => {
    const cargar = () => {
      getProductosContext()
      
    }
    cargar()
  }, [])
  useEffect(() => {
    setStockFiltrado(productos)
  }, [productos])

  const cambiarFiltro = (textoFiltro) => {
    // filtrar por nombre, proveedor o codigo
    let nuevoFiltro = productos.filter((producto) => {
      return producto.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) || producto.proveedor.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) || producto.codigo.toLowerCase().includes(textoFiltro.toLowerCase())
    })
    setStockFiltrado(nuevoFiltro)
  }
  // Acciones extra
  const refrescarTabla = async () => {
    const toastId = toast.loading('Refrescando', {id: 'toastId'})
    const { success }  = await getProductosContext()
    if (success) {
      toast.dismiss(toastId, {id: 'toastId'})
      toast.success('Tabla refrescada')
    } else {
      toast.dismiss(toastId, {id: 'toastId'})
      toast.error('error al refrescar la Tabla')
    }
  }
  const imprimirTabla = () => {
    print()
  }
  const debounceCambiarFiltro = debounce(cambiarFiltro, 300) // Debounce para retrazar la ejecucion de la funcion cambiarFiltro
  const debounceRefrescarTabla = debounce(refrescarTabla, 300) // Debounce para retrazar la ejecucion de la funcion refrescarTabla

  return (
    <>
      <ValidarStocks productos={productos} listaStocks={stockFiltrado} filtrar={debounceCambiarFiltro} imprimir={imprimirTabla} refrescar={debounceRefrescarTabla}/>
    </>
  )
}
