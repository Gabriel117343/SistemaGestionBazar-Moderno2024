
export const PedidoDetalle = ({ pedido }) => {
  console.log(pedido)
  return (
    <section className="pedido-detalle">
      <h2>Pedido {pedido.codigo}</h2>
      <article>
        <div
          className="card-detalle-pedido"
      
        >
          <div>
            <p>
              <strong>Proveedor:</strong> {pedido.proveedor.nombre}
            </p>
            <p>
              <strong>Contacto:</strong> {pedido.proveedor.persona_contacto}
            </p>
            <p>
              <strong>Teléfono:</strong> {pedido.proveedor.telefono}
            </p>
            <p>
              <strong>Fecha del Pedido:</strong>{" "}
              {new Date(pedido.fecha_pedido).toLocaleDateString()}
            </p>
            <p>
              <strong>Estado:</strong> {pedido.estado}
            </p>
            <p>
              <strong>Total:</strong> ${pedido.total}
            </p>
            <p>
              <strong>Observación:</strong> {pedido.observacion}
            </p>
          </div>
        </div>
      </article>

      <article className="pedido-productos">
        <h3>Productos:</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.producto}</td>
                  <td>{producto.nombre}</td>
                  <td className="text-center">{producto.cantidad}</td>
                  <td className="text-right">${producto.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};
