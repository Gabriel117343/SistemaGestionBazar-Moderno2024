import { useMemo } from "react";


export const PaginationButton = ({
  currentPage,
  cambiarPagina,
  totalDatos,
  cantidadPorPagina,
}) => {


  const totalBotones = useMemo(() => {
    return Math.ceil(totalDatos / cantidadPorPagina);
  }, [totalDatos, cantidadPorPagina]);

  console.log({currentPage, totalBotones, totalDatos, cantidadPorPagina});

  return (
    <div className="pt-1 d-flex gap-1">
      {Array.from({ length: totalBotones }, (_, index) => (
        <button
          key={index + 1}
          className={`btn ${parseInt(currentPage) === index + 1 ? "btn-info" : "btn-secondary"}`}
          onClick={() => cambiarPagina({ newPage: index + 1 })}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};
