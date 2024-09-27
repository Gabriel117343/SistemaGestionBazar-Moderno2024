
export const WithoutResults = ({ message }) => {
  return (
    <div className="alert alert-warning mt-3" role="alert">
      <h5 className="text-center">
        {message ? message : "No se encontraron resultados"}
      </h5>
    </div>
  );
};
