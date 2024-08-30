
import Swal from "sweetalert2";
import './messages.css'
export const confirmarCategoria = ({
  nuevaCategoria,
  productoNombre,
  categoriaActual,
  setCategoriaSeleccionada,
}) => {
  
  // si la categoria actual es la misma que la nueva, no se hace nada y si se quiere cambiar a la misma categoria se mantiene la categoria actual
  if (parseInt(nuevaCategoria.id) === parseInt(categoriaActual.id)) return setCategoriaSeleccionada(categoriaActual.id);


  const nuevaCategoriaNombre = nuevaCategoria.nombre.replace(nuevaCategoria.nombre[0], nuevaCategoria.nombre[0].toUpperCase());


  Swal.fire({
    title: "Advertencia",
    text: `Los registros de las ventas del producto ${productoNombre} se mantendrán, pero a partir de ahora se registrarán en la categoría ${nuevaCategoriaNombre}. `,

    icon: "warning",
    input: "text",

    inputPlaceholder: `Escribe "Cambiar categoria a ${nuevaCategoria.nombre}." para confirmar`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const inputValue = Swal.getInput().value;
      if (inputValue.trim() === "") {
        Swal.showValidationMessage("Debe escribir algo.");
        return false;
      } else if (inputValue.trim() !== `Cambiar categoria a ${nuevaCategoria.nombre}.`) {
        Swal.showValidationMessage(
          `El texto no coincide. Por favor, escribe exactamente "Cambiar categoria a ${nuevaCategoria.nombre}."`
        );
        return false;
      }
      return true;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // si el usuario confirma se cambia la categoria a través del id
      setCategoriaSeleccionada(nuevaCategoria.id);
    }
  })
};

export const confirmarSeccion = ({
  nuevaSeccion,
  productoNombre,
  SeccionActual,
  setSeccionSeleccionada,
}) => {
  
  // si la Seccion actual es la misma que la nueva, no se hace nada y si se quiere cambiar a la misma Seccion se mantiene la Seccion actual
  if (parseInt(nuevaSeccion.id) === parseInt(SeccionActual.id)) return setSeccionSeleccionada(SeccionActual.id);


  const nuevaSeccionNombre = nuevaSeccion.nombre.replace(nuevaSeccion.nombre[0], nuevaSeccion.nombre[0].toUpperCase());


  Swal.fire({
    title: "Advertencia",
    text: `Los registros de las ventas del producto ${productoNombre} se mantendrán, pero a partir de ahora se registrarán en la sección ${nuevaSeccionNombre}. `,

    icon: "warning",
    input: "text",

    inputPlaceholder: `Escribe "Cambiar seccion a ${nuevaSeccion.nombre}." para confirmar`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const inputValue = Swal.getInput().value;
      if (inputValue.trim() === "") {
        Swal.showValidationMessage("Debe escribir algo.");
        return false;
      } else if (inputValue.trim() !== `Cambiar seccion a ${nuevaSeccion.nombre}.`) {
        Swal.showValidationMessage(
          `El texto no coincide. Por favor, escribe exactamente "Cambiar seccion a ${nuevaSeccion.nombre}."`
        );
        return false;
      }
      return true;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // si el usuario confirma se cambia la Seccion a través del id
      setSeccionSeleccionada(nuevaSeccion.id);
    }
  })
};