import React from 'react';
import './skeleton.css'; // Asegúrate de crear un archivo CSS para los estilos

const Skeleton = ({ height, width, borderRadius = '4px' }) => {
  return (
    <div
      className="skeleton"
      style={{
        height: height,
        width: width,
        borderRadius: borderRadius,
      }}
    ></div>
  );
};

export default Skeleton;