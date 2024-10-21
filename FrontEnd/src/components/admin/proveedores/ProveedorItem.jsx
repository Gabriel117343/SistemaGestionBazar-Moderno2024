import React from "react";

export const ProveedorItem = ({
  proveedor,
  edicionProveedor,
  borrarProovedor,
  contador
}) => {

  return (
    <tr>
      <td>{contador}</td>
      <td>{proveedor.fecha_creacion.substring(0, 10)}</td>
      <td>{proveedor.nombre}</td>
      <td>{proveedor.persona_contacto}</td>
      <td>{proveedor.telefono}</td>
      <td>{proveedor.direccion}</td>
      <td>
        {proveedor.estado ? (
          <div
            style={{ borderRadius: "35px" }}
            className="border d-flex justify-content-center bg-success text-white"
          >
            <p className="m-0">Activo</p>
          </div>
        ) : (
          <div
            style={{ borderRadius: "35px" }}
            className="border d-flex d-flex justify-content-center bg-danger text-white"
          >
            <p className="m-0">Inactivo</p>
          </div>
        )}
      </td>
      <td className="text-center">
        <button
          className="btn btn-info"
          onClick={() => edicionProveedor(proveedor.id)}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
      </td>
      <td className="text-center">
        <button
          className="btn btn-danger"
          onClick={() => borrarProovedor(proveedor.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};
