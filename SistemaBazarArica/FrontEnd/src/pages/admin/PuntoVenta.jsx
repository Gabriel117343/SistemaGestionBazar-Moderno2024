import React, { useContext } from 'react'
import { PuntoVentaSmart } from '../../components/admin/puntoVenta/PuntoVentaSmart'
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
export const PuntoVenta = () => {

  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-3 titulo-page">
          <div style={{fontSize: '30px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <i className="bi bi-shop"></i>
          </div>
          <GradualSpacing text="Realizar Ventas" className='m-0' type='h2'/>
        </div>
          <PuntoVentaSmart />
      </section>
  )
}
