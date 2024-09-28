import React from "react";
import classNames from "classnames/dedupe";
import "./shared.css";
export const ButtonSave = ({ className, onClick, children, ...props }) => {
  // classnames es una libreria que permite combinar clases de forma dinamica
  const buttonClass = classNames("btn btn-success btn-ease", className);
  const atributos = {
    className: buttonClass,
    type: "submit",
    onClick: onClick,
    "aria-label": "Guardar",
    ...props,
  };
  return <button {...atributos}>{children ? children : "Guardar"}</button>;
};

export const ButtonCancel = ({ className, onClick, children, ...props }) => {
  const buttonClass = classNames("btn btn-danger btn-ease", className);
  const atributos = {
    className: buttonClass,
    type: "button",
    onClick: onClick,
    "aria-label": "Cancelar",
    ...props, // las demás propiedades se agregan al boton
  };
  return <button {...atributos}>{children ? children : "Cancelar"}</button>;
};
