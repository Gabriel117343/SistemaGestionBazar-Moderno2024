import React from "react";

export const ButtonRefresh = (props) => {
  // en caso se pase un icono, reemplazara al por defecto
  return (
    <button
      className={`btn btn-outline-primary btn-nuevo-animacion ${props.className}`}
      onClick={props.onClick}
      {...props}
      aria-label="Recargar"
    >
      {props.children ? props.children : <i className="bi bi-arrow-repeat"></i>}
    </button>
  );
};
export const ButtonPrint = (props) => {
  return (
    <button
      className={`btn btn-outline-primary btn-nuevo-animacion ${props.className}`}
      onClick={props.onClick}
      aria-label="Imprimir"
      {...props}
    >
      {props.children ? props.children : <i className="bi bi-printer"></i>}
    </button>
  );
};
