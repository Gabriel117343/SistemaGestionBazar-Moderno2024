import { FcShop } from "react-icons/fc";
import { ListaDeOpciones } from "../../components/admin/dashboard/ListaDeOpciones";

import { Grafico } from "../../components/admin/dashboard/Grafico";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
import "./stylepages.css";
export const Dashboard = () => {
  return (
    <>
      <section className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
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

        <div className="container-grid">
          <ListaDeOpciones />

          <Grafico />
        </div>
      </section>
    </>
  );
};
