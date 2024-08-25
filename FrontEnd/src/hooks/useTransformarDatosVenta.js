// Hook personalizado para manejar el carrito de compras - CUSTOM HOOK REUTILIZABLE
// sera utilizado tanto para el Admin como para el Vendedor
export default function useTransformarDatosVenta() {
  return (carrito) => {
    function obtenerInfoVentaTipo() {
      const totalTiposCarrito = new Set(
        carrito.map((producto) => producto.tipo.id)
      );
      const categorias = [];
      totalTiposCarrito.forEach((id) => {
        const tipoEnCarrito = carrito.filter((prod) => prod.tipo.id === id);
        const cantidad = tipoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad,
          0
        );
        const total = tipoEnCarrito.reduce(
          (acc, prod) => acc + prod.cantidad * parseFloat(prod.precio),
          0
        );

        categorias.push({
          entidad_id: id,
          cantidad: cantidad,
          total: total,
        });
      });
      return { tipo: [...categorias] };
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
        productos.push({
          entidad_id: id,
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
        proveedores.push({
          entidad_id: proveedorId,
          cantidad: cantidad,
          total: total,
        });
      });
      return { proveedor: [...proveedores] };
    }
    return [
      obtenerInfoVentaTipo(),
      obtenerInfoVentaProducto(),
      obtenerInfoVentaProveedor(),
    ];
  };
}
