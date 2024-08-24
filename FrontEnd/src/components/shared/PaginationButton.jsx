export const PaginationButton = ({
  currentPage,
  setCurrentPage,
  totalDatos,
  cantidadPorPagina,
}) => {
  const totalBotones = Math.ceil(totalDatos / cantidadPorPagina);
  return (
    <>
      {Array.from({ length: totalBotones }, (_, index) => (
        <button
          key={index + 1}
          className={`btn ${currentPage === index + 1 ? "btn-info" : "btn-secondary"}`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </>
  );
};
