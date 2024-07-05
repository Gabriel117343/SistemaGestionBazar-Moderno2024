import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { SidebarContext } from "../../context/SidebarContext";
import "./Menu.css";

//MENU DE OPCIONES PARA EL ADMINISTRADOR
export const Menu = ({ children }) => {
  const accionSidebar = () => {
    cambiarEstadoSidebar();
  };

  const {
    stateLogin: { usuario, isAuth },
  } = useContext(LoginContext);
  const { cambiarEstadoSidebar, sidebar } = useContext(SidebarContext);
  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <i className="bi bi-speedometer"></i>,
    },
    {
      path: "/admin/compras",
      name: "Compras",
      icon: <i className="bi bi-basket2-fill"></i>,
    },
    {
      path: "/admin/recibos",
      name: "Recibos",
      icon: <i className="bi bi-receipt"></i>,
    },
    {
      path: "/admin/devoluciones",
      name: "Devoluciones",
      icon: <i className="bi bi-arrow-return-left"></i>,
    },
    {
      path: "/admin/stocks",
      name: "Stock",
      icon: <i className="bi bi-box"></i>,
    },
    {
      path: "/admin/ventas",
      name: "Ventas",
      icon: <i className="bi bi-cart4"></i>,
    },
    {
      path: "/admin/punto-venta",
      name: "Punto de Venta",
      icon: <i className="bi bi-shop-window"></i>,
    },
    {
      name: "Mantenimiento",
    },
    {
      path: "/admin/proveedores",
      name: "Proveedores",
      icon: <i className="bi bi-truck"></i>,
    },
    {
      path: "/admin/productos",
      name: "Productos",
      icon: <i className="bi bi-bag"></i>,
    },
    {
      path: "/admin/usuarios",
      name: "Usuarios",
      icon: <i className="bi bi-people"></i>,
    },
    {
      path: "/admin/secciones",
      name: "Secciones",
      icon: <i className="bi bi-layers-fill"></i>,
    },
    {
      path: "/admin/configuracion",
      name: "Configuracion",
      icon: <i className="bi bi-gear"></i>,
    },
  ];
  return (
    <div className="contenedor">
      <aside style={{ width: sidebar ? "350px" : "50px" }} className="sidebar">
        <div className="top_section pt-4">
          {sidebar ? (
            <div className="d-flex align-items-center gap-3 pb-3 ps-1 justify-content-around">
              <div className="d-flex align-items-center gap-2">
                {usuario && isAuth ? (
                  <>
                    <img
                      width="50px"
                      height="50px"
                      style={{
                        display: sidebar ? "block" : "none",
                        borderRadius: "30px",
                      }}
                      className="logo "
                      src={
                        usuario.imagen
                          ? usuario.imagen
                          : "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                      }
                      alt={`imagen de ${usuario.nombre}`}
                    />
                    <strong className="text-capitalize pt-2">
                      {usuario.nombre} {usuario.apellido}
                    </strong>
                  </>
                ) : (
                  <>
                    <img
                      width="50px"
                      height="50px"
                      style={{
                        display: sidebar ? "block" : "none",
                        borderRadius: "30px",
                      }}
                      className="logo "
                      src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                      alt="Esta es una imagen por defecto"
                    />
                    <strong>Sin Nombre</strong>
                  </>
                )}
              </div>

              <div className="bars ms-5 py-2 px-2">
                <FaBars onClick={accionSidebar} />
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center py-2">
              <FaBars onClick={accionSidebar} />
            </div>
          )}
          {menuItems.map((item, index) => (
            <NavLink to={item.path} key={index} className="link">
              <div className="icon">{item.icon}</div>

              <div
                style={{ display: sidebar ? "block" : "none" }}
                className="link_text"
              >
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
      </aside>

      <main>{children}</main>
    </div>
  );
};
