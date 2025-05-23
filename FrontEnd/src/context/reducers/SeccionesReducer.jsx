import React from "react";

export const SeccionesReducer = (stateSeccion, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_SECCIONES":
      return {
        ...stateSeccion,
        secciones: payload.secciones,
        cantidad: payload.cantidad,
        page: payload.page,
        page_size: payload.page_size,
      };
    case "GET_SECCION":
      return {
        ...stateSeccion,
        seccionSeleccionada: payload,
      };
    case "CREATE_SECCION":
      return {
        ...stateSeccion,
        secciones: [...stateSeccion.secciones, payload],
      };
    case "DELETE_SECCION":
      return {
        ...stateSeccion,
        secciones: stateSeccion.secciones.filter(
          (seccion) => seccion.id !== payload
        ),
      };
    case "UPDATE_SECCION":
      return {
        ...stateSeccion,
        secciones: stateSeccion.secciones.map((seccion) =>
          seccion.id === payload.id ? payload : seccion
        ),
      };
    default:
      return stateSeccion;
  }
};
