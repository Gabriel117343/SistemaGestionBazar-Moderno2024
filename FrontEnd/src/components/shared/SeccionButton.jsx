import "./shared.css";

export const SeccionButton = ({
  filtrarPorSeccion,
  productos,
  secciones,
  productosPorPagina,
}) => {
  const verificarCoincidencia = (seccionNumero) => {
    if (productos.length !== productosPorPagina) {
      const newClase = productos?.some(
        (producto) => producto?.seccion?.numero === seccionNumero
      )
        ? "btn-filtro"
        : "";

      return newClase;
    }
    return "";
  };

  return (
    <>
      {secciones?.map((seccion) => (
        <div key={seccion.id} className="seccion">
          <button
            onClick={() => filtrarPorSeccion({ idSeccion: seccion.id })}
            className={`btn-seleccion ${verificarCoincidencia(seccion.numero)}`}
          >
            {seccion.nombre}
          </button>
        </div>
      ))}
    </>
  );
};
