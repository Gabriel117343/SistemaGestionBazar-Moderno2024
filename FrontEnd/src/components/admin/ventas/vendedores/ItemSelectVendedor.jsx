import React from "react";

export const ItemSelectVendedor = ({ vendedor, contador, totalVentas }) => {
  return (
    <tr>
      <td>{contador}</td>
      <td>
        {vendedor.nombre.split(" ")[0]} - {vendedor.apellido.split(" ")[0]}
      </td>
      <td>{vendedor.rut}</td>
      <td align="center">{totalVentas}</td>
    </tr>
  );
};
