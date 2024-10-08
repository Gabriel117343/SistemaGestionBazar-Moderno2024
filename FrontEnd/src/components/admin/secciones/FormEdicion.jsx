import React, { useState, useId } from "react";
import { toast } from "react-hot-toast";
import { ButtonCancel, ButtonSave } from "../../shared/ButtonFormulario";

export const FormEdicion = ({ cerrarModal, seccion, actualizarSeccion }) => {
  const { nombre, numero, descripcion, imagen } = seccion;
  const imagenInicial = imagen
    ? imagen
    : "../../../public/images/seccion-productos.jpg"; // si no hay imagen, se muestra una por defecto
  const [vistaImagen, setVistaImagen] = useState(imagenInicial); // estado para la vista previa de la imagen
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const enviarFormulario = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const img = event.target[3].files[0];
    if (!img) {
      formData.delete("imagen"); // si no hay imagen, se elimina del formData, para que no se envie al servidor
    }
    const toastId = toast.loading("Cargando...", { id: "loading" });
    const { success, message } = await actualizarSeccion(seccion.id, formData);
    if (success) {
      toast.dismiss(toastId, { id: "loading" });
      toast.success(message);
      cerrarModal();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.dismiss(toastId, { id: "loading" });
      toast.error(message);
      cerrarModal();
    }
  };
  const cambiarVistaImagen = (event) => {
    setVistaImagen(URL.createObjectURL(event.target.files[0]));
  };
  return (
    <form action="" id={`form-edicion-${id}`} onSubmit={enviarFormulario}>
      <div>
        {vistaImagen && (
          <img
            style={{ width: "100%", height: "200px" }}
            src={vistaImagen}
            alt="esto es una imagen de una seccion"
            className="rounded"
          />
        )}
      </div>
      <div className="form-group pt-2">
        <label htmlFor="nombre">Nombre</label>
        <input
          className="form-control"
          type="text"
          name="nombre"
          defaultValue={nombre}
        />
      </div>
      <div className="form-group">
        <label htmlFor="numero">Numero</label>
        <input
          className="form-control"
          type="number"
          name="numero"
          defaultValue={numero}
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
          defaultValue={descripcion}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="imagen">Imagen (opcional)</label>
        <input
          className="form-control"
          type="file"
          accept=".jpg, .jpge, .png"
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
