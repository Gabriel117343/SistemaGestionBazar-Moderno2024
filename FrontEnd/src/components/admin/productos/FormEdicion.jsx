import React, { useId, useContext, useEffect, useState } from "react";
import { ProductosContext } from "../../../context/ProductosContext";
import { ProveedoresContext } from "../../../context/ProveedoresContext";
import { SeccionesContext } from "../../../context/SeccionesContext";
import toast from "react-hot-toast";

import { confirmarCategoria, confirmarSeccion } from "./messages/ConfirmacionCambios";

const TOTAL_DATA = {
  page: 1,
  page_size: 20, // hasta 20 productos por pagina
}

export const FormEdicion = ({ cerrarModal, producto, categorias }) => {
  const { id, nombre, proveedor, precio, estado, imagen } = producto;
  const { actualizarProductoContext } = useContext(ProductosContext);
  const {
    stateProveedor: { proveedores },
    getProveedoresContext,
  } = useContext(ProveedoresContext);
  const {
    stateSeccion: { secciones },
    getSeccionesContext,
  } = useContext(SeccionesContext);
  const imagenIncial = imagen
    ? imagen
    : "../../../public/images/seccion-productos.jpg";
  const [vistaImagen, setVistaImagen] = useState(imagenIncial); // estado para la vista previa de la imagen
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    producto?.categoria?.id
  );
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(producto?.seccion?.id);
  useEffect(() => {
    async function cargarSecciones () {

      const { success, message} = await getSeccionesContext(TOTAL_DATA); // obtiene las secciones
      if (!success) {
        toast.error(message ?? 'Error al cargar las secciones');
      }
    };
    cargarSecciones();
  }, []);
  useEffect(() => {
    async function cargarProveedores() {
      const { success, message } = await getProveedoresContext(TOTAL_DATA);
      if (!success) {
        toast.error(message ?? 'Error al cargar los proveedores');
      }
    }
    cargarProveedores();
  })
  const idFormAdmin = useId(); // buena practica para generar id unicos
  const enviarFormulario = async (event) => {
    event.preventDefault();
    const formulario = new FormData(event.target);
    const img = event.target[6].files[0];
    if (!img) {
      formulario.delete("imagen"); // si no hay imagen, se elimina del formData, para que no se envie al servidor
    }
    const estado = formulario.get("estado") === "true"; // si es estado es true, se convierte a booleano
    formulario.set("estado", estado);
    const { success, message } = await actualizarProductoContext(
      id,
      formulario
    );
    if (success) {
      cerrarModal();
      toast.success(message);
    } else {
      cerrarModal();
      toast.error(message);
    }
  };
  const cambiarVistaImagen = (event) => {
    const imagen = event.target.files[0];
    if (imagen) {
      // si hay una imagen
      setVistaImagen(URL.createObjectURL(imagen)); // crear una url temporal de la imagen
    }
  };

  return (
    <form action="" onSubmit={enviarFormulario} id={`${idFormAdmin}-edicion`}>
      <div>
        <img
          style={{ width: "100%", height: "200px" }}
          src={vistaImagen}
          alt="Imagen de Producto"
          className="rounded"
        />
      </div>
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          placeholder="Nombre del producto"
          name="nombre"
          defaultValue={nombre}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="seccion">Seccion</label>
        <select
          name="seccion"
          id="seccion"
          className="form-control"
          value={seccionSeleccionada}
          onChange={(e) => {
            confirmarSeccion({
              nuevaSeccion: secciones.find((seccion) => seccion.id === parseInt(e.target.value)),
              productoNombre: producto?.nombre,
              SeccionActual: producto?.seccion,
              setSeccionSeleccionada,
            });

          }}
        >
          {secciones.map((seccion) => (
            <option key={seccion.id} value={seccion.id}>
              {" "}
              {/** esto mapea sobre los proveedores y envia el id del proveedor seleccionado para que en django lo busque */}
              {seccion.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="categoria">Categoria</label>
        <select
          name="categoria"
          id="categoria"
          className="form-control"
          value={categoriaSeleccionada}
          onChange={(e) =>
            confirmarCategoria({
              nuevaCategoria: categorias.find((categoria) => categoria.id === parseInt(e.target.value)),
              productoNombre: producto?.nombre,
              categoriaActual: producto?.categoria,
              setCategoriaSeleccionada,
            })
          }
        >
          {categorias.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="proveedor">Proveedor</label>
        <select
          name="proveedor"
          id="proveedor"
          className="form-control"
          defaultValue={proveedor.id}
          
        >
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {" "}
              {/** esto mapea sobre los proveedores y envia el id del proveedor seleccionado para que en django lo busque */}
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          type="number"
          className="form-control"
          id="precio"
          name="precio"
          placeholder=" 93934374374"
          defaultValue={precio}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="estado">Estado</label>
        <select
          className="form-control"
          id="estado"
          name="estado"
          defaultValue={estado}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="imagen">Imagen (opcional)</label>
        <input
          type="file"
          className="form-control"
          onChange={cambiarVistaImagen}
          id="imagen"
          name="imagen"
        />
      </div>
      <div className="d-flex justify-content-between pt-3">
        <button type="submit" className="btn btn-success">
          Editar
        </button>
        <button type="button" className="btn btn-danger" onClick={cerrarModal}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
