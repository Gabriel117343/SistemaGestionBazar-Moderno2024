import { Login } from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import { CargaDePagina } from "./views/CargaDePagina";
import { Toaster } from "react-hot-toast";

import { LoginContext } from "./context/LoginContext";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // si esta en la ruta login o / y tiene el token, se redirige a la ruta admin
      const { pathname } = window.location;
      if (
        pathname === "/" ||
        (pathname === "/login" && usuario?.rol === "administrador")
      ) {
        console.log("Redirigiendo a /admin/dashboard");
        return window.location.replace("/admin/dashboard");
      } else if (
        pathname === "/login" ||
        (pathname === "/" && usuario?.rol === "vendedor")
      ) {
        console.log("Redirigiendo a /vendedor/dashboard");
        // return window.location.replace('/vendedor/dashboard');
      }
      
      if (isAuth === false) {
        console.log("Volviendo a obtener el usuario logeado");
        obtenerUsuarioLogeado(token).finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000); // finally se ejecuta cuando se resuelve la promesa o cuando se rechaza
        });
      }
    } else {
      console.log("No hay token disponible");
      setLoading(false);
    }
  }, [isAuth, location.pathname]);

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
            <Toaster />
          </BrowserRouter>
        </ProductosProvider>
      </ClientesProvider>
    </VentasProvider>
  );
}

export default App;
