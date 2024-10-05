import useCategoriaStore from "../../context/store/categoriaStore";
import { useEffect, forwardRef } from "react";
import { toast } from 'react-hot-toast';


export const CategoriaSelect = forwardRef(({ filtroCategoria, parametroCategoria, id }, ref) => {
  const { categorias, geAllCategoriasStore } = useCategoriaStore();

  useEffect(() => {
    async function cargarCategorias() {
      const { success, message } = await geAllCategoriasStore();

      if (!success) {
        toast.error(message ?? "Ha ocurrido un error inesperado al cargar las categorias");
      }
    }
    cargarCategorias();
  }, []);

  return (
    <select
      ref={ref}
      className="form-control"
      name="categoria"
      id={id ?? "categoriaSelect"}
      onChange={(e) => filtroCategoria(e.target.value)}
      value={parametroCategoria} // persistira el valor haún cuando se recargue la pagina gracias a los parametros de busqueda
    >
      <option value="all">Todas</option>
      {categorias?.map(({ id, nombre }) => (
        <option key={id} value={id}>
          {nombre}
        </option>
      ))}
    </select>
  );
});
