![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat-square)
![Django](https://img.shields.io/badge/Django-4.2.0-green.svg?style=flat-square)
![Django Rest Framework](https://img.shields.io/badge/DRF-3.14.0-red.svg?style=flat-square)
![JWT Authentication](https://img.shields.io/badge/Auth-JWT-brightgreen.svg?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.8-orange.svg?style=flat-square)


Este sistema de gestión está diseñado para facilitar la administración de productos, pedidos, stock, secciones y proveedores.
(versión en desarrollo)

## Características del Sistema

- **Gestión de Productos**: Permite añadir, actualizar, listar y eliminar productos, con soporte para filtrar por estado de activación.
- **Control de Stock**: Actualiza automáticamente el stock al recibir productos o realizar ventas, con manejo eficiente del inventario.
- **Administración de Pedidos**: Facilita la creación, actualización y eliminación de pedidos, incluyendo la opción de marcar pedidos como recibidos y ajustar el stock.
- **Manejo de Secciones y Proveedores**: Ofrece gestión de secciones y proveedores asociados a productos y pedidos, garantizando una estructura organizada.
- **Autenticación Segura**: Utiliza JWT para garantizar la autenticidad y seguridad en las operaciones, restringiendo el acceso a usuarios autenticados.
- **Jornada Laboral**: Permite Administrar la jornada laboral de los usuarios del sistema para restringir el acceso no autorizado al sistema.
- **Control de Ventas**: Permite Visualizar las ventas por cada Vendedor a través de dashboards y tablas de ventas.

## Estructura de los modelos

| Tabla           | Descripción                                            |
|-----------------|--------------------------------------------------------|
| **Producto**    | Almacena información sobre productos, incluyendo nombre, proveedor, sección, y estado. |
| **Stock**       | Registra la cantidad disponible de cada producto, permitiendo ajustes y actualizaciones. |
| **Pedido**      | Gestiona los pedidos realizados, incluyendo detalles del proveedor y estado del pedido. |
| **ProductoPedido** | Relaciona productos con pedidos específicos, gestionando las cantidades y detalles. |
| **Cliente**     | Contiene la información de los clientes que realizan pedidos. |
| **Venta**       | Registra las ventas realizadas y ajusta el stock en consecuencia. |
| **Sección**     | Clasifica los productos en secciones o categorías.    |
| **Proveedor**   | Contiene datos sobre los proveedores de productos.   |

## Instalación y Configuración

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/Gabriel117343/SistemaGestionBazar-Moderno2024

  ```
  cd FrotEnd > npm install 
  ````


> Uso de JWT (Json Web Token)
```javascript
import { createApiInstance } from './config/axiosConfig';

const usuariosApi = createApiInstance('usuarios/datos/v1/usuarios')

// Autenticación basada en token JWT (Json Web Token) con Django Rest Framework (DRF) y React
export const getAllUsers = (token) => {
  // return axios.get("http://127.0.0.1:8000/usuarios/datos/v1/usuarios/") // anterior
  return usuariosApi.get('/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }) // nueva forma
}

export const getUser = (id, token) => {
  return usuariosApi.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createUser = async (usuario, token) => {
  return usuariosApi.post('/', usuario, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteUser = (id, token) => {
  return usuariosApi.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateUser = (id, usuario, token) => {
  return usuariosApi.put(`/${id}/`, usuario, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}
