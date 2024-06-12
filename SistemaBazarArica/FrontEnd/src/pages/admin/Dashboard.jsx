import React from "react";
import { FcShop } from "react-icons/fc";
import { ListaDeOpciones } from "../../components/admin/dashboard/ListaDeOpciones";
import { StocksProvider } from "../../context/StocksContext";
import { PedidosProvider } from "../../context/PedidosContext";
import { Grafico } from "../../components/admin/dashboard/Grafico";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
import "./Pages.css";
export const Dashboard = () => {
  return (
    <>
      <section className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3  pt-3 titulo-page">
          <div
            style={{ fontSize: "40px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <FcShop />
          </div>
          <GradualSpacing
            text="Sistema de Gestion para el Bazar"
            className="m-0"
            type="h1"
          />
        </div>
        <PedidosProvider>
          <StocksProvider >
            <div className="container-grid">
              <ListaDeOpciones />
             
              <Grafico/>
            </div>
          </StocksProvider>
        </PedidosProvider>
      </section>
    </>
  );
};
