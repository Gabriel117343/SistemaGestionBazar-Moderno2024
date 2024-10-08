import { useState, useId } from "react";
import { toast } from "react-hot-toast";
import { ButtonSave, ButtonCancel } from "../../shared/ButtonFormulario";

export const FormRegistroSecciones = ({ cerrarModal, crearSeccion }) => {
  const imagenIncial = "../../../public/images/seccion-productos.jpg";
  const [vistaImagen, setVistaImagen] = useState(imagenIncial); // estado para la vista previa de la imagen

  const [isLoading, setIsLoading] = useState(false);
  const id = useId(); 

  const enviarFormulario = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Cargando...", { id: "loading" });
    const formData = new FormData(event.target);
    const { success, message } = await crearSeccion(formData);
    if (success) {

      toast.dismiss(toastId, { id: "loading" });
      toast.success(message);
      cerrarModal();
    } else {

      toast.dismiss(toastId, { id: "loading" });
      toast.error(message);
      cerrarModal();
    }
  };
  const cambiarVistaImagen = (event) => {
    setVistaImagen(URL.createObjectURL(event.target.files[0])); // esto crea una url de la imagen
  };
  return (
    <form action="" id={`form-registro-${id}`} onSubmit={enviarFormulario}>
      <div>
        <img
          style={{ width: "100%", height: "200px" }}
          src={vistaImagen}
          alt="esto es una imagen de una seccion"
          className="rounded"
        />
      </div>
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input className="form-control" id="nombre" type="text" name="nombre" />
      </div>
      <div className="form-group">
        <label htmlFor="numero">Numero</label>
        <input
          className="form-control"
          type="number"
          id="numero"
          name="numero"
        />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">
          Descripcion <small>(opcional)</small>
        </label>
        <textarea
          style={{ maxHeight: "180px" }}
          className="form-control"
          name="descripcion"
          id="descripcion"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="imagen">
          Imagen <small>(opcional)</small>
        </label>
        <input
          className="form-control"
          accept=".jpg, .jpeg, .png"
          id="imagen"
          type="file"
          name="imagen"
          onChange={cambiarVistaImagen}
        />
      </div>
      <div className="d-flex justify-content-between pt-2">
        <ButtonSave disabled={isLoading}>Guardar</ButtonSave>
        <ButtonCancel disabled={isLoading} onClick={cerrarModal}>
          Cancelar
        </ButtonCancel>
      </div>
    </form>
  );
};
