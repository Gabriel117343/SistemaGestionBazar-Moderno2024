
// Función que calcula el campo contador (#) de fila en una tabla que maneje paginación
const calcularContador = ({ index, pageSize, currentPage }) => {
  return (currentPage - 1) * pageSize + index + 1;
};

export default calcularContador;