import { BsInboxesFill } from "react-icons/bs";
import "./stylepages.css";
import { PedidosProvider } from "../../context/PedidosContext";
import { TablaPedidosContenedor } from "../../components/admin/compras/TablaPedidosContenedor";
import { ProveedoresProvider } from "../../context/ProveedoresContext";
import { StocksProvider } from "../../context/StocksContext";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
export const Compras = () => {
  return (
    <>
      <section className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
          <div
            style={{ fontSize: "30px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <BsInboxesFill />
          </div>
          <GradualSpacing text="Ordenes De Compra" className="m-0" type="h2" />
        </div>
        <StocksProvider>
          <ProveedoresProvider>
            {/** se pasa el contexto */}
            <PedidosProvider>
              <TablaPedidosContenedor />
            </PedidosProvider>
          </ProveedoresProvider>
        </StocksProvider>
      </section>
    </>
  );
};
