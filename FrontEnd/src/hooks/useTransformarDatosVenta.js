// Hook personalizado para manejar el carrito de compras - CUSTOM HOOK REUTILIZABLE
// sera utilizado tanto para el Admin como para el Vendedor
export default function useTransformarDatosVenta() {
  return (carrito) => {
    console.log(carrito)
    function obtenerInfoVentaCategoria() {
      const totalTiposCarrito = new Set(
        carrito.map((producto) => producto.categoria.id)
      );
      const categorias = [];
      totalTiposCarrito.forEach((id) => {
        const tipoEnCarrito = carrito.filter((prod) => prod.categoria.id === id);
        const cantidad = tipoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad,
          0
        );
        
        const total = tipoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad * parseFloat(prod.precio),
          0
        );
        // Estos id seran para poder filtrar en las ventasCategoria por producto o seccion
        const productoId = tipoEnCarrito[0].id
        const proveedorId = tipoEnCarrito[0].proveedor.id
        const seccionId = tipoEnCarrito[0].seccion.id

        categorias.push({
          entidad_id: id,
          producto_id: productoId,
          proveedor_id: proveedorId,
          seccion_id: seccionId,
          cantidad: cantidad,
          total: total,
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
        const cantidad = productoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad,
          0
        );
        const total = productoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad * parseFloat(prod.precio),
          0
        );
        // Estos id seran para poder filtrar en las ventasProducto por categoria o proveedor
        const categoriaId = productoEnCarrito[0].categoria.id
        const proveedorId = productoEnCarrito[0].proveedor.id
        const seccionId = productoEnCarrito[0].seccion.id
        productos.push({
          entidad_id: id,
          categoria_id: categoriaId,
          proveedor_id: proveedorId,
          seccion_id: seccionId,
          cantidad: cantidad,
          total: total,
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
        const cantidad = productosDelProveedor.reduce(
          (acc, prod) => acc + prod.cantidad,
          0
        );
        const total = productosDelProveedor.reduce(
          (acc, prod) => acc + prod.cantidad * parseFloat(prod.precio),
          0
        );
        // Estos id seran para poder filtrar en las ventasProveedor por categoria o producto
        const categoriaId = productosDelProveedor[0].categoria.id
        const productoId = productosDelProveedor[0].id
        const seccionId = productosDelProveedor[0].seccion.id

        proveedores.push({
          entidad_id: proveedorId,
          categoria_id: categoriaId,
          producto_id: productoId,
          seccion_id: seccionId,
          cantidad: cantidad,
          total: total,
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
        const cantidad = calculo.cantidad
        const total = calculo.total

        const categoriaId = productosDeSeccion[0].categoria.id
        const productoId = productosDeSeccion[0].id
        const proveedorId = productosDeSeccion[0].proveedor.id
        secciones.push({
          entidad_id: seccionId,
          categoria_id: categoriaId,
          producto_id: productoId,
          proveedor_id: proveedorId,
          cantidad: cantidad,
          total: total,
        });
      });
      
      return { seccion: [...secciones] };
    }

    return [
      obtenerInfoVentaCategoria(),
      obtenerInfoVentaProducto(),
      obtenerInfoVentaProveedor(),
      obtenerInfoVentaSeccion(),
    ];
  };
}
