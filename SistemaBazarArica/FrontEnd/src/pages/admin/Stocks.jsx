import React from 'react'
import { ProductosProvider } from '../../context/ProductosContext' // importando el contexto de los stocks
import { StockSmart } from '../../components/admin/stocks/StockSmart' // importando el componente que contiene la tabla de stocks
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
        <ProductosProvider>
          <StockSmart />
        </ProductosProvider>
      </section>
  )
}
