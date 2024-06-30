import { ProductosProvider } from '../../context/ProductosContext'
import { ProveedoresProvider } from '../../context/ProveedoresContext'
import { StockSmart } from '../../components/admin/stocks/StockSmart'
import { FaBoxes } from "react-icons/fa";
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
export const Stocks = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
          <div style={{fontSize: '40px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <FaBoxes />
          </div>
          <GradualSpacing text="Stock en Tienda" className='m-0' type='h2'/>
        </div>
        <ProveedoresProvider>
          <ProductosProvider>
            <StockSmart />
          </ProductosProvider>
        </ProveedoresProvider>
      </section>
  )
}
