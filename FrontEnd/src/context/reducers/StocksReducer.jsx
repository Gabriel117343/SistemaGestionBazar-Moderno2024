
export const StocksReducer = (stateStock, action) => {
  const { type, payload } = action // destructuring de la accion

  switch (type) {

    case 'GET_STOCKS':
      return {
        ...stateStock,
        stocks: payload.stocks,
        cantidad: payload.cantidad, 
        page: payload.page,
        page_size: payload.page_size
      }
    case 'GET_STOCK':
      return {
        ...stateStock,
        stockSeleccionado: payload // guarda el stock seleccionado en el estado
      }
    case 'UPDATE_STOCK':
      return {
        ...stateStock, // copia el estado actual del componente
        stocks: stateStock.stocks.map((stock) => stock.id === payload.id ? payload : stock) // actualiza el stock  que se modifico y deja los demas igual como estaban antes de la modificacion
      }
    case 'RECIBIR_STOCK':
      return {
        ...stateStock,
        stocks: stateStock.stocks.map((stock) => stock.id === payload.id ? payload : stock)
      }
    default:
      return stateStock // retorna el estado actual del componente si no se ejecuta ninguna accion
  }
}
