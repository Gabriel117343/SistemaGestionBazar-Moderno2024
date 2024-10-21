import { createContext, useReducer } from "react";
import {
  getAllProveedores,
  getProveedor,
  createProveedor,
  deleteProveedor,
  updateProveedor,
} from "../api/proveedores.api";
import { ProveedoresReducer } from "./reducers/ProveedoresReducer";

export const ProveedoresContext = createContext(); // creando el contexto de los proveedores para poder usarlo en cualquier componente

export const ProveedoresProvider = ({ children }) => {
  const initialState = {
    proveedores: [],
    proveedorSeleccionado: null,
    cantidad: 0,
    page: 0,
    page_size: 0,
  }; // estado inicial de los proveedores para el Reducer de los proveedores
  const [stateProveedor, dispatch] = useReducer(
    ProveedoresReducer,
    initialState
  );

  const TOKEN_ACCESO = localStorage.getItem("accessToken");
  const getProveedoresContext = async (parametros) => {
    console.log({ parametros });
    try {
      const res = await getAllProveedores(parametros); // res para referenciarse al response del servidor
      
      if (res.status === 200) {
        dispatch({
          type: "GET_PROVEEDORES",
          payload: {
            proveedores: res.data.results,
            cantidad: res.data.count,
            page: parametros.page,
            page_size: parametros.page_size,
          },
        });
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      console.error(error);
      return { success: false, message: error.response.data.error };
    }
  };
  const getProveedorContext = async (id) => {
    try {
      const res = await getProveedor(id, TOKEN_ACCESO);

      console.log(res.status);
      if (res.status === 200) {
        dispatch({
          type: "GET_PROVEEDOR",
          payload: res.data,
        }); // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los proveedores
        console.log(stateProveedor.proveedorSeleccionado);
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      return { success: false, message: error.response.data.error };
    }
  };
  const crearProveedor = async (proveedor) => {
    try {
      const res = await createProveedor(proveedor, TOKEN_ACCESO);
      console.log(res);
      console.log(res);
      if (res.status === 201) {
        dispatch({
          type: "CREATE_PROVEEDOR",
          payload: res.data.data,
        }); // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los proveedores
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor

      return { success: false, message: error.response.data.error };
    }
  };
  const eliminarProveedor = async (id) => {
    try {
      const res = await deleteProveedor(id, TOKEN_ACCESO);
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: "DELETE_PROVEEDOR",
          payload: id,
        }); // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los proveedores
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      return { success: false, message: error.response.data.error };
    }
  };
  const actualizarProveedor = async (id, proveedor) => {
    try {
      const res = await updateProveedor(id, proveedor, TOKEN_ACCESO);

      if (res.status === 200 || res.status === 201) {
        dispatch({
          type: "UPDATE_PROVEEDOR",
          payload: res.data.data,
        }); // si la peticion es exitosa se ejecuta el dispatch para actualizar el estado global de los proveedores
        return { success: true, message: res.data.message };
        // return ({ success: true, message: 'Usuario obtenido' }) > Asi se puede retornar un mensaje de exito sin necesidad de obtenerlo del response del servidor
      }
      return { success: false, message: res.data.error };
    } catch (error) {
      // si hay un error en la peticion se ejecuta este bloque que captura el response del servidor
      return { success: false, message: error.response.data.error };
    }
  };
  return (
    <ProveedoresContext.Provider
      value={{
        stateProveedor,
        getProveedoresContext,
        getProveedorContext,
        crearProveedor,
        eliminarProveedor,
        actualizarProveedor,
      }}
    >
      {children}
    </ProveedoresContext.Provider>
  );
};
