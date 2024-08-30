// Hook personalizado para manejar el carrito de compras - CUSTOM HOOK REUTILIZABLE
// sera utilizado tanto para el Admin como para el Vendedor

export default function useTransformarDatosVenta() {
  return (carrito) => {

    function obtenerInfoVentaCategoria() {
      // el Set asegura que no se repitan los id de las categorias
      const totalTiposCarrito = new Set(
        carrito.map((producto) => producto.categoria.id)
      );
      const categorias = [];
      totalTiposCarrito.forEach((id) => {
        const tipoEnCarrito = carrito.filter((prod) => prod.categoria.id === id);

        const calculo = tipoEnCarrito.reduce((acc, prod) => {
          return {
            cantidad: acc.cantidad + prod.cantidad,
            total: acc.total + prod.cantidad * parseFloat(prod.precio),
          }
        },{ cantidad: 0, total: 0 });

        // Estos id seran para poder filtrar en las ventasCategoria por producto o seccion

        categorias.push({
          entidad_id: id,
          producto_id: tipoEnCarrito[0].id,
          proveedor_id: tipoEnCarrito[0].proveedor.id,
          seccion_id: tipoEnCarrito[0].seccion.id,
          cantidad: calculo.cantidad,
          total: calculo.total,
        });
      });
      return { categoria: [...categorias] };
    }

    // Obtener información por producto
    function obtenerInfoVentaProducto() {
      const productos = [];
      const totalProductosCarritoId = new Set(
        carrito.map((producto) => producto.id)
      );
      totalProductosCarritoId.forEach((id) => {
        const productoEnCarrito = carrito.filter((prod) => prod.id === id);

        const calculo = productoEnCarrito.reduce((acc, prod) => {
          return {
            cantidad: acc.cantidad + prod.cantidad,
            total: acc.total + prod.cantidad * parseFloat(prod.precio),
          }
        },{ cantidad: 0, total: 0 });

        productos.push({
          entidad_id: id,
          categoria_id: productoEnCarrito[0].categoria.id,
          proveedor_id: productoEnCarrito[0].proveedor.id,
          seccion_id: productoEnCarrito[0].seccion.id,
          cantidad: calculo.cantidad,
          total: calculo.total,
        });
      });
      return { producto: [...productos] };
    }

    // Obtener información por proveedor
    function obtenerInfoVentaProveedor() {
      const proveedores = [];
      const totalProveedoresCarritoId = new Set(
        carrito.map((producto) => producto.proveedor.id)
      );
      totalProveedoresCarritoId.forEach((proveedorId) => {
        const productosDelProveedor = carrito.filter(
          (prod) => prod.proveedor.id === proveedorId
        );

        const calculo = productosDelProveedor.reduce((acc, prod) => {
          return {
            cantidad: acc.cantidad + prod.cantidad,
            total: acc.total + prod.cantidad * parseFloat(prod.precio),
          };
        }, { cantidad: 0, total: 0 });


        proveedores.push({
          entidad_id: proveedorId,
          categoria_id: productosDelProveedor[0].categoria.id,
          producto_id: productosDelProveedor[0].id,
          seccion_id: productosDelProveedor[0].seccion.id,
          cantidad: calculo.cantidad,
          total: calculo.total,
        });
      });
      return { proveedor: [...proveedores] };
    }

    function obtenerInfoVentaSeccion() {
      const secciones = [];
      const totalSeccionesCarritoId = new Set(
        carrito.map((producto) => producto.seccion.id)
      );
      totalSeccionesCarritoId.forEach((seccionId) => {
        const productosDeSeccion = carrito.filter(
          (prod) => prod.seccion.id === seccionId
        );
        const calculo = productosDeSeccion.reduce((acc, prod) => {
          return {
            cantidad: acc.cantidad + prod.cantidad,
            total: acc.total + prod.cantidad * parseFloat(prod.precio),
          };
        }, { cantidad: 0, total: 0 });

        secciones.push({
          entidad_id: seccionId,
          categoria_id: productosDeSeccion[0].categoria.id,
          producto_id: productosDeSeccion[0].id,
          proveedor_id:  productosDeSeccion[0].proveedor.id,
          cantidad: calculo.cantidad,
          total: calculo.total,
        });
      });
      
      return { seccion: [...secciones] };
    }

    const resultado = [
      obtenerInfoVentaCategoria(),
      obtenerInfoVentaProducto(),
      obtenerInfoVentaProveedor(),
      obtenerInfoVentaSeccion(),
    ];

    return resultado
  };
}
