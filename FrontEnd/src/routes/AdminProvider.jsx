import { UsuariosProvider } from "../context/UsuariosContext";
import { SeccionesProvider } from "../context/SeccionesContext";
import { ProductosPedidosProvider } from "../context/ProductosPedidosContext";
import { SidebarProvider } from "../context/SidebarContext";
import { PedidosProvider } from "../context/PedidosContext";
import { StocksProvider } from "../context/StocksContext";
import { CarritoProvider } from "../context/CarritoContext";
import { ProveedoresProvider } from "../context/ProveedoresContext";
import { ProductosProvider } from "../context/ProductosContext";
// Este componente se encarga de proveer todos los contextos necesarios para la administración
export const AdminProvider = ({ children }) => {
  return (
    <CarritoProvider>
      <StocksProvider>
        <ProductosPedidosProvider>
          <SeccionesProvider>
            <UsuariosProvider>
              <PedidosProvider>
                <ProveedoresProvider>
                  <ProductosProvider>
                    <PedidosProvider>
                      <SidebarProvider>{children}</SidebarProvider>
                    </PedidosProvider>
                  </ProductosProvider>
                </ProveedoresProvider>
              </PedidosProvider>
            </UsuariosProvider>
          </SeccionesProvider>
        </ProductosPedidosProvider>
      </StocksProvider>
    </CarritoProvider>
  );
};
