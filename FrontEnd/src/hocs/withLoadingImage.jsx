import React, { useState, useEffect } from 'react';
// HOC que muestra un mensaje de carga mientras se carga una imagen
export function withLoadingImage(WrappedComponent) {
  return function(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const img = new Image();
      img.src = props.src;
      img.onload = () => setLoading(false);
    }, [props.src]);

    return (
      <>
        {loading && <h3>Cargando...</h3>}
        <WrappedComponent {...props} style={{display: loading ? 'none' : 'block'}} />
      </>
    );
  };
}

