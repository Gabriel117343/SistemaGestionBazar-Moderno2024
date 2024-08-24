
// Hook que recibe los datos a mostrar, la página actual y la cantidad de datos por página y devuelve los datos a mostrar en la página actual. (que seran renderizados en la vista)
export default function useFiltroDatosMostrar ({currentPage, datosPorPagina, datos}) {

  const startIndex = (currentPage - 1) * datosPorPagina;
  const endIndex = startIndex + datosPorPagina;
  const datosMostrar = datos.slice(startIndex, endIndex);
  return datosMostrar;
}
