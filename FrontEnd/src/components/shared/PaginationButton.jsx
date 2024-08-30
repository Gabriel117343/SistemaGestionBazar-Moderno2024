export const PaginationButton = ({
  currentPage,
  cambiarPagina,
  totalDatos,
  cantidadPorPagina,
}) => {
  const totalBotones = Math.ceil(totalDatos / cantidadPorPagina);

  return (
    <>
      {Array.from({ length: totalBotones }, (_, index) => (
        <button
          key={index + 1}
          className={`btn ${parseInt(currentPage) === index + 1 ? "btn-info" : "btn-secondary"}`}
          onClick={() => cambiarPagina({newPage: index + 1})}
        >
          {index + 1}
        </button>
      ))}
    </>
  );
};
