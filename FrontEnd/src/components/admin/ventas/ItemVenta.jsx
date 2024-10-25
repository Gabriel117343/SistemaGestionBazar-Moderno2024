
export const ItemVenta = ({ contador, venta }) => {
  return (
    <tr key={venta.id}>
      <td>{contador}</td>
      <td>{venta.id}</td>
      <td>
        {venta.vendedor.nombre.split(" ")[0]}{" "}
        {venta.vendedor.apellido.split(" ")[0]}
      </td>
      <td>{new Date(venta.fecha_venta).toLocaleDateString()} </td>
      <td>
        <i className="bi bi-clock-history"></i>{" "}
        {`${new Date(venta.fecha_venta).toLocaleTimeString()}`}
      </td>
      <td>
        {venta.cliente.nombre.split(" ")[0]}{" "}
        {venta.cliente.apellido.split(" ")[0]}
      </td>
      <td>{venta.cliente.rut}</td>
      <td>{venta.cliente.telefono}</td>
      <td>{venta.total}</td>
    </tr>
  );
};
