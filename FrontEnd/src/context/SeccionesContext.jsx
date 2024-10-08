import { createContext, useReducer } from "react";

import { SeccionesReducer } from "./reducers/SeccionesReducer";
import {
  getAllSecciones,
  getSeccion,
  createSeccion,
  deleteSeccion,
  updateSeccion,
} from "../api/secciones.api";

export const SeccionesContext = createContext(); // creando el contexto de los secciones para poder usarlo en cualquier componente

export const SeccionesProvider = ({ children }) => {
  const initialState = {
    secciones: [],
    cantidad: 0,
    page: 0,
    page_size: 0,
    seccionSeleccionada: null,
  }; // estado inicial de los secciones para el Reducer de los secciones
  const [stateSeccion, dispatch] = useReducer(SeccionesReducer, initialState); //

  const TOKEN_ACCESO = localStorage.getItem("accessToken");
  const getSeccionesContext = async (props) => {
    try {
      const res = await getAllSecciones(props); // res para referenciarse al response del servidor

      if (res.status === 200) {
        dispatch({
          type: "GET_SECCIONES",
          payload: {
            secciones: res.data.results,
            cantidad: res.data.count,
            page: props.page,
            page_size: props.page_size,
          },
        });
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error);
      return { success: false, message: error.response.data.error };
    }
  };
  const getSeccionContext = async (id) => {
    try {
      const res = await getSeccion(id, TOKEN_ACCESO);
      if (res.status === 200) {
        dispatch({
          type: "GET_SECCION",
          payload: res.data,
        }); // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los secciones
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      return { success: false, message: error.response.data.error };
    }
  };
  const crearSeccionContext = async (seccion) => {
    try {
      const res = await createSeccion(seccion, TOKEN_ACCESO);
      console.log(res);
      if (res.status === 201 || res.status === 200) {
        dispatch({
          type: "CREATE_SECCION",
          payload: res.data.data,
        });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };
  const eliminarSeccionContext = async (id) => {
    try {
      const res = await deleteSeccion(id, TOKEN_ACCESO);
      console.log(res);
      if (res.status === 200) {
        dispatch({
          type: "DELETE_SECCION",
          payload: id,
        });
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };
  const actualizarSeccionContext = async (id, seccion) => {
    try {
      const res = await updateSeccion(id, seccion, TOKEN_ACCESO);

      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: "UPDATE_SECCION",
          payload: res.data.data,
        });
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };
  return (
    <SeccionesContext.Provider
      value={{
        stateSeccion,
        getSeccionesContext,
        getSeccionContext,
        crearSeccionContext,
        eliminarSeccionContext,
        actualizarSeccionContext,
      }}
    >
      {children}
    </SeccionesContext.Provider>
  );
};
