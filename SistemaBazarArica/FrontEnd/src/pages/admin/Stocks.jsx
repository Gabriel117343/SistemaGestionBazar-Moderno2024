import React from 'react'
import { StocksProvider } from '../../context/StocksContext' // importando el contexto de los stocks
import { TablaStocksContenedor } from '../../components/admin/stocks/TablaStocksContenedor' // importando el componente que contiene la tabla de stocks
import { FaBoxes } from "react-icons/fa";
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
export const Stocks = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-3 titulo-page">
          <div style={{fontSize: '40px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <FaBoxes />
          </div>
          <GradualSpacing text="Stock en Tienda" className='m-0' type='h2'/>
        </div>
        <StocksProvider>
          <TablaStocksContenedor />
        </StocksProvider>
      </section>
  )
}
