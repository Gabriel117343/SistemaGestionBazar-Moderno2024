import "./views.css";
// Para mostrar un spinner de carga de página en el centro de la pantalla mientras se carga la página
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
