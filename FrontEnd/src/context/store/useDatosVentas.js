import { create } from "zustand";
import { createApiInstance } from "../../api/config/axiosConfig";


const datosVentasApi = createApiInstance("usuarios");

const useDatosVentas = create((set) => ({
  ventasPorCategoria: [],
  ventasPorProducto: [],
  ventasPorProveedor: [],
  ventasPorSeccion: [],

  getVentasPorCategoria: async (parametros) => {
    try {
      const res = await datosVentasApi.get("/ventas_categorias/", {
        params: {
          page_size: 5,
          fecha_inicio: parametros.fecha_inicio,
          fecha_fin: parametros.fecha_fin,
        },
      });
      console.log(res)

      if (res.status === 200) {
        set({ ventasPorCategoria: res.data.results, cantidad: res.data.count });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Error al obtener las ventas por categoría", error);
      return {
        success: false,
        message: get(
          error,
          "response.data.message",
          "Error al obtener las ventas por categoría"
        ),
      };
    }
  },

  getVentasPorProducto: async (parametros) => {
    try {
      const res = await datosVentasApi.get("/ventas_productos/", {
    
        params: {
          page_size: 100,
          fecha_inicio: parametros.fecha_inicio,
          fecha_fin: parametros.fecha_fin,
        }
      });
      console.log(res)
      if (res.status === 200) {
        set({ ventasPorProducto: res.data.results, cantidad: res.data.count });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Error al obtener las ventas por producto", error);
      return {
        success: false,
        message: get(
          error,
          "response.data.message",
          "Error al obtener las ventas por producto"
        ),
      };
    }
  },

  getVentasPorProveedor: async () => {
    try {
      const res = await datosVentasApi.get("/ventas_proveedores/");
      if (res.status === 200) {
        set({ ventasPorProveedor: res.data.results, cantidad: res.data.count });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Error al obtener las ventas por proveedor", error);
      return {
        success: false,
        message: get(
          error,
          "response.data.message",
          "Error al obtener las ventas por proveedor"
        ),
      };
    }
  },

  getVentasPorSeccion: async () => {
    try {
      const res = await datosVentasApi.get("/ventas_secciones/");
      if (res.status === 200) {
        set({ ventasPorSeccion: res.data.results, cantidad: res.data.count });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: get(
          error,
          "response.data.message",
          "Error al obtener las ventas por sección"
        ),
      };
    }
  },
}));
export default useDatosVentas;
