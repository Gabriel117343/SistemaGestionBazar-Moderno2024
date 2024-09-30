import React from "react";

export const ItemSeccion = ({ seccion, contador, editar, borrar }) => {

  return (
    <tr>
      <td scope="row">{contador}</td>
      <td>{seccion.nombre}</td>

      <td>{seccion.numero}</td>
      <td>{seccion.descripcion}</td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={() => editar(seccion.id)}
            aria-label="Editar"
            className="btn btn-outline-primary btn-nuevo-animacion"
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            onClick={() => borrar(seccion.id)}
            aria-label="Eliminar"
            className="btn btn-outline-danger "
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};
