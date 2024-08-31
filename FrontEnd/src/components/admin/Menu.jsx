import { useContext, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { SidebarContext } from "../../context/SidebarContext";
import "./Menu.css";

//MENU DE OPCIONES PARA EL ADMINISTRADOR
export const Menu = ({ children }) => {
  
  const {
    stateLogin: { usuario, isAuth },
  } = useContext(LoginContext);
  const { cambiarEstadoSidebar, sidebar } = useContext(SidebarContext);
 
  const accionSidebar = () => {
    cambiarEstadoSidebar();
  };

  useEffect(() => {
    const sidebarMenu = document.querySelector('.sidebar');

    if (sidebarMenu) {
      const toggleAnimation = () => {
        // Si el sidebar está abierto, aplicamos la animación de cierre
        // se establece forwards para que la animación se quede en el último frame (abierto) o (cerrado) 
        if (sidebar) {
          sidebarMenu.style.animation = 'desplazar 0.8s forwards';
        } else {
          
          sidebarMenu.style.animation = 'retroceder 0.5s forwards';
        }
      };

      // Observamos el cambio de estado para aplicar la animación correspondiente
      toggleAnimation();

    }
  }, [sidebar]); // Dependencia: el efecto se re-ejecuta cuando cambia el estado de sidebarAbierto
  

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <i className="bi bi-speedometer"></i>,
    },
    {
      path: "/admin/compras?page=1",
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
      path: "/admin/stocks?page=1",
      name: "Stock",
      icon: <i className="bi bi-box"></i>,
    },
    {
      path: "/admin/venta?page=1",
      name: "Ventas",
      icon: <i className="bi bi-cart4"></i>,
    },
    {
      path: "/admin/punto-venta?page=1?incluir_inactivos=false",
      name: "Punto de Venta",
      icon: <i className="bi bi-shop-window"></i>,
    },
    {
      name: "Mantenimiento",
    },
    {
      path: "/admin/proveedores?page=1",
      name: "Proveedores",
      icon: <i className="bi bi-truck"></i>,
    },
    {
      path: "/admin/productos?page=1&incluir_inactivos=true",
      name: "Productos",
      icon: <i className="bi bi-bag"></i>,
    },
    {
      path: "/admin/usuarios?page=1",
      name: "Usuarios",
      icon: <i className="bi bi-people"></i>,
    },
    {
      path: "/admin/secciones?page=1",
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
      <aside className={`sidebar `}>
        <div className="top_section pt-4">
          {sidebar ? (
            <div className="d-flex align-items-center gap-1 pb-3 ps-2 justify-content-between informaciones-user">
              <div className="d-flex align-items-center gap-2">
                {usuario && isAuth ? (
                  <>
                  <div className="min-imagen-usuario">
                    <img
                    loading="lazy"
                    style={{
                      display: sidebar ? "block" : "none",
                    
                    }}
                    className="logo "
                    src={
                      usuario.imagen
                        ? usuario.imagen.replace('http://localhost:8000/', 'https://dwq9c4nw-8000.brs.devtunnels.ms/')
                        : "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                    }
                    alt={`imagen de ${usuario.nombre.split(' ')[0]}`}
                  />
                  </div>
                  <strong className="text-capitalize pt-2 nombre-usuario">
                    {usuario.nombre} {usuario.apellido.split(' ')[0]}
                  </strong>
                  </>
                ) : (
                  <>
                    <div className="min-imagen-usuario">
                      <img
                        style={{
                          display: sidebar ? "block" : "none"
                        }}
                        className="logo "
                        src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                        alt="Esta es una imagen por defecto"
                      />
                      <strong>Sin Nombre</strong>
                    </div>
                  </>
                )}
              </div>

              <div className="bars py-2 pe-2 ms-1 btn-sidebar">
                <FaBars onClick={accionSidebar} />
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center py-2 btn-sidebar">
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
