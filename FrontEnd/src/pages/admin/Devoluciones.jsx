import { ImBoxRemove } from "react-icons/im";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
import "./stylepages.css";
export const Devoluciones = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
        <div
          style={{ fontSize: "30px" }}
          className="d-flex align-items-center p-0 m-0 ms-2"
        >
          <ImBoxRemove />
        </div>
        <GradualSpacing text="Devoluciones" className="m-0" type="h2" />
      </div>
    </section>
  );
};
