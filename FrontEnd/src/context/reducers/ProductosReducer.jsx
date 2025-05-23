

export const ProductosReducer = (stateProducto, action ) => {

  const { type, payload } = action // destructuring de la accion
  switch (type) {
    case 'GET_PRODUCTOS':
        return {
        ...stateProducto,
        productos: payload.productos,
        cantidad: payload.cantidad,
        page: payload.page,
        page_size: payload.page_size
      };
    case 'GET_PRODUCTO':
      return {
        ...stateProducto,
        productoSeleccionado: payload // guarda el producto seleccionado en el estado
      }
    case 'CREATE_PRODUCTO':
      return {
        ...stateProducto,
        productos: [...stateProducto.productos, payload] // agrega el nuevo producto al arreglo de productos
      }
    case 'DELETE_PRODUCTO':
      return {
        ...stateProducto,
        productos: stateProducto.productos.filter((producto) => producto.id !== payload) // filtra los productos que no sean el que se quiere eliminar
      }
    case 'UPDATE_PRODUCTO':
      return {
        ...stateProducto, // copia el estado actual del componente
        productos: stateProducto.productos.map((producto) => producto.id === payload.id ? payload : producto) // actualiza el producto  que se modifico y deja los demas igual como estaban antes de la modificacion
      }
    case 'SET_CANTIDAD':
      return {
        ...stateProducto,
        cantidad: payload // guarda la cantidad de productos en el estado
      }
    default:
      return stateProducto // retorna el estado actual del componente si no se ejecuta ninguna accion
  }
}
