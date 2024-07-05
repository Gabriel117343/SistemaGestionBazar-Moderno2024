import "./views.css";
export const CargaDePagina = () => {
  return (
    <section
      className="fondo-carga"
    >
      <div>
        <div>
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <strong className="btn-shine texto-espera">Espere un momento porfavor...</strong>
      </div>
    </section>
  );
};
