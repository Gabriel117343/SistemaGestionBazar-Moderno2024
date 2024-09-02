import useCategoriaStore from "../../context/store/categoriaStore";
import { useEffect, forwardRef } from "react";
import { toast } from 'react-hot-toast';
export const CategoriaSelect = forwardRef(({ filtroCategoria }, ref) => {
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
      id="categoriaSelect"
      onChange={(e) => filtroCategoria({ idCategoria: e.target.value })}
      defaultValue="all"
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
