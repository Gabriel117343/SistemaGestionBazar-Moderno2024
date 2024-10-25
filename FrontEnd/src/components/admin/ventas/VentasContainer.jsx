import React, { useContext, useState, useEffect } from 'react'
import { VentasContext } from "../../../context/VentasContext";
import CargaDeDatos from '../../../views/CargaDeDatos';

import { FiltroVentas } from './FiltroVentas'
import { ValidarVentas } from './ListaVentas'
import { PaginacionVentas } from './PaginacionVentas'

export const VentasContainer = () => {
  const {
    stateVenta: { ventas, cantidad, page, page_size },
    getVentasContext,
  } = useContext(VentasContext);
 

  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <FiltroVentas ventas={ventas} setIsLoading={setIsLoading} getVentas={getVentasContext} />
      
      {isLoading ? (
        <CargaDeDatos />
      ) : (
        <ValidarVentas ventas={ventas} currentPage={page} pageSize={page_size}/>
      )}
      <PaginacionVentas cantidad={cantidad} />
    </>
  )
}
