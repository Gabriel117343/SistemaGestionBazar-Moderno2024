import { Routes, Route, Navigate } from "react-router-dom";
import { HeaderAdmin } from "../views/HeaderAdmin";
// PAGINAS DEL ADMINISTRADOR
import { Dashboard } from "../pages/admin/Dashboard";
import { Compras } from "../pages/admin/Compras";
import { Recibos } from "../pages/admin/Recibos";
import { Devoluciones } from "../pages/admin/Devoluciones";
import { Stocks } from "../pages/admin/Stocks";
import { Ventas } from "../pages/admin/Ventas";
import { Proveedores } from "../pages/admin/Proveedores";
import { Productos } from "../pages/admin/Productos";
import { Usuarios } from "../pages/admin/Usuarios";
import { Configuracion } from "../pages/admin/Configuracion";

import { PuntoVenta } from "../pages/admin/PuntoVenta";

import { Secciones } from "../pages/admin/Secciones";

// MENU DE OPCIONES PARA EL ADMINISTRADOR
import { Menu } from "../components/admin/Menu";
import CustomModal from "../views/CustomModal";
import { AdminProvider } from "./AdminProvider";
export const AdminRoutes = () => {
  return (
    <AdminProvider>
      <HeaderAdmin />
      <CustomModal />
      <Menu>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />{" "}
          {/* si no se encuentra la ruta se redirecciona a dashboard */}
          <Route path="/compras" element={<Compras />} />
          <Route path="/recibos" element={<Recibos />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/stocks/:proveedorId?" element={<Stocks />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/punto-venta" element={<PuntoVenta />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/secciones" element={<Secciones />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </Menu>
    </AdminProvider>
  );
};
