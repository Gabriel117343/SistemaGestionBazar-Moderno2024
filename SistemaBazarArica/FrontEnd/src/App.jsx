import { Login } from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import { CargaDePagina } from "./views/CargaDePagina";
import { toast, Toaster } from "react-hot-toast";

import { LoginContext } from "./context/LoginContext";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AdminRoutes } from "./routes/AdminRoutes";
import { ProductosProvider } from "./context/ProductosContext";

import "./App.css";
import { HerramientaDesarrollo } from "./views/HerramientaDesarrollo";
import { ClientesProvider } from "./context/ClientesContext";
import { VentasProvider } from "./context/VentasContext";

function App() {
  const {
    obtenerUsuarioLogeado,
    stateLogin: { isAuth, usuario },
  } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);

  const redireccionarUsuario = (rol) => {
    switch (rol) {
      case "administrador":
        console.log("Usuario administrador logeado");
        window.location.replace("/admin/dashboard");
        break;
      case "vendedor":
        window.location.replace("/admin/vendedor");
        console.log("Usuario vendedor logeado");
        break;
      default:
        console.log("Usuario no tiene rol asignado");
        window.location.replace("/login");
        break;
      // acción que siempre se ejecuta en switch
    }
  };
  async function validarSesion() {
    const { success, message } = await obtenerUsuarioLogeado().finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
    if (!success) {
      toast.error(message ?? "Ha ocurrido un Error inesperado", {
        id: "loading",
        duration: 2000,
      });
      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.replace("/login");
        }, 1000);
      }
    }
  }
  useEffect(() => {
    const tokenAcceso = localStorage.getItem("accessToken");
    const tokenRefresco = localStorage.getItem("refreshToken");
    const { pathname } = window.location;

    if (
      !tokenAcceso &&
      !tokenRefresco &&
      window.location.pathname !== "/login"
    ) {
      console.log("No hay token disponible");
      setTimeout(() => {
        setLoading(false);
        window.location.replace("/login");
      }, 1000);

      return;
    } else if ((pathname === "/login" || pathname === "/") && isAuth === true) {
      console.log("Usuario ya logeado");

      redireccionarUsuario(usuario.rol);
    } else if (!tokenRefresco && tokenAcceso === null) {
      console.log("No hay token de refresco");
      if (pathname !== "/login") {
        window.location.replace("/login");
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      if (isAuth === false) {
        validarSesion();
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }
  }, [isAuth]);

  if (loading) {
    return <CargaDePagina />; // si loading es true se muestra el componente CargaDePagina
  }

  return (
    <VentasProvider>
      <ClientesProvider>
        <ProductosProvider>
          {/* este es el contexto de los productos */}
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
            <HerramientaDesarrollo />
            <Toaster /> {/* Aquí se renderiza el componente Toaster de react-hot-toast. documentación > https://github.com/timolins/react-hot-toast/blob/main/site/pages/docs/styling.mdx*/}
          </BrowserRouter>
        </ProductosProvider>
      </ClientesProvider>
    </VentasProvider>
  );
}

export default App;
