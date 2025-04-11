# Sistema de Gestión Bazar

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat-square)](#)
[![Django](https://img.shields.io/badge/Django-4.2.0-green.svg?style=flat-square)](#)
[![Django Rest Framework](https://img.shields.io/badge/DRF-3.14.0-red.svg?style=flat-square)](#)
[![JWT Authentication](https://img.shields.io/badge/Auth-JWT-brightgreen.svg?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](#)
[![Version](https://img.shields.io/badge/Version-1.8-orange.svg?style=flat-square)](#)

**Proyecto desarrollado durante el 2023 - 2024**  
*(Nota: Debido a que la migración a TypeScript (para seguridad) significaría migrar todos los componentes del Sistema, conto con la llegada de TailwindCSS 4 y React 19, decidí no seguir profundizando en este proyecto (por la escalabilidad) aunque gran parte es funcional.)*

Este sistema de gestión está diseñado para facilitar la administración de productos, pedidos, stock, secciones y proveedores. Incorpora autenticación segura con JWT, control de ventas, manejo de secciones y proveedores, y una interfaz moderna usando **React**, **Tailwind CSS**, **React-Bootstrap**, entre otras tecnologías.

---

## Tabla de Contenidos
1. [Características del Sistema](#características-del-sistema)  
2. [Arquitectura General](#arquitectura-general)  
3. [Estructura de Modelos](#estructura-de-modelos)  
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)  
5. [Instalación y Configuración](#instalación-y-configuración)  
6. [Uso de JWT (Json Web Token)](#uso-de-jwt-json-web-token)  
7. [Licencia](#licencia)  

---

## Características del Sistema

- **Gestión de Productos**  
  Añadir, actualizar, listar y eliminar productos. Soporta filtrado por estado de activación.  
- **Control de Stock**  
  Actualiza automáticamente el stock al recibir productos o realizar ventas, manejando eficientemente el inventario.  
- **Administración de Pedidos**  
  Crear, actualizar y eliminar pedidos; marcar pedidos como recibidos y ajustar el stock en consecuencia.  
- **Manejo de Secciones y Proveedores**  
  Organización jerárquica de productos y pedidos en secciones y proveedores respectivos.  
- **Autenticación Segura**  
  Utiliza JWT para garantizar la autenticidad y seguridad en las operaciones, restringiendo el acceso a usuarios autenticados.  
- **Jornada Laboral**  
  Permite administrar los horarios de los usuarios para controlar el acceso al sistema.  
- **Control de Ventas**  
  Ofrece dashboards y tablas para visualizar ventas por cada vendedor.

---

## Arquitectura General



<!--
![Arquitectura del Backend](ruta/a/la-imagen-backend.png)

![Arquitectura del Frontend](ruta/a/la-imagen-frontend.png)
-->
### Front End - React

<img src="https://github.com/user-attachments/assets/b043cb61-d410-4a54-afc7-e669a4be6623" alt="Arquitectura Front End" width="800px" />

### Back End - Django Rest Framework

<img src="https://github.com/user-attachments/assets/ae5cd6a6-7826-4009-be7e-67eeac1d81a0" alt="Arquitectura Front End" width="800px" />

- **Backend Container**  
  - Construido con **Django** y **Django REST Framework**.
  - Servicios principales: autenticación JWT, manejo de productos, pedidos, stock y proveedores.
  - Base de datos: PostgreSQL o SQLite (dependiendo de la configuración).

- **Frontend Container**  
  - Construido en **React** (con Vite), usando librerías como **Tailwind CSS**, **React-Bootstrap** y **Framer Motion**.
  - Estructura de componentes reutilizables para login, panel de administración, gráficas, etc.
  
- **Data Models**  
  - Definidos en Django y expuestos mediante una API para su consumo en el frontend.

---

## Estructura de Modelos

| Tabla              | Descripción                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------|
| **Producto**       | Información sobre productos (nombre, proveedor, sección, estado).                            |
| **Stock**          | Registra la cantidad disponible de cada producto.                                             |
| **Pedido**         | Gestión de pedidos realizados (proveedor, estado, etc.).                                      |
| **ProductoPedido** | Relaciona productos con pedidos, incluyendo cantidades y detalles de cada uno.               |
| **Cliente**        | Información de los clientes que realizan pedidos.                                            |
| **Venta**          | Registra las ventas y ajusta el stock automáticamente.                                       |
| **Sección**        | Clasifica los productos en secciones o categorías.                                           |
| **Proveedor**      | Almacena los datos de los proveedores de productos.                                          |

---

## Tecnologías Utilizadas

- **Frontend**  
  - [React](https://reactjs.org/) (v18.x)  
  - [Vite](https://vitejs.dev/)  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - [React-Bootstrap](https://react-bootstrap.github.io/)  
  - [Framer Motion / React Magic Motion](https://www.framer.com/motion/)  
  - [Recharts](https://recharts.org/) para gráficas  
  - [Zustand](https://github.com/pmndrs/zustand) para administración de estados  

- **Backend**  
  - [Django](https://www.djangoproject.com/) (v4.x)  
  - [Django REST Framework](https://www.django-rest-framework.org/) (v3.x)  
  - [JWT Authentication](https://jwt.io/)  

- **Base de Datos**  
  - [SQLite](https://www.sqlite.org/index.html)  
  - (Opcional) [PostgreSQL](https://www.postgresql.org/) u otra base de datos según la configuración  

---

## Instalación y Configuración

1. **Clonar el Repositorio**  
```bash
git clone https://github.com/Gabriel117343/SistemaGestionBazar-Moderno2024
cd SistemaGestionBazar-Moderno2024
```
1. Configuración del FrontEnd
  - Navega hasta la carpeta del FrontEnd 
  - Instala las dependencias:
```bash
npm install
npm run dev
```
  - en caso de problemas con @testing-library ejecuta `npm install --legacy-peer-deps`
  - Abre http://localhost:5173 (cors headers habilitados unicamente a este puerto) para ver la aplicación en tu navegador.

3. Configuración del BackEnd

  - Asegúrate de contar con un entorno virtual (opcional, pero recomendado).
  - Instala las dependencias de Django (según requirements.txt o Pipfile).
  - Configura la base de datos en settings.py (por defecto, SQLite).
  - Ejecuta migraciones y levanta el servidor:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
  - El backend estará disponible en http://127.0.0.1:8000.

## Uso de JWT (Json Web Token)
Este proyecto utiliza JWT (Json Web Token) para autenticar y autorizar peticiones al servidor.

  - 1. El usuario inicia sesión y obtiene un token JWT.

  - 2. Cada petición al servidor (por ejemplo, para crear o editar un pedido) debe incluir el token en la cabecera Authorization: Bearer <tu-token>.

Esto garantiza la seguridad de las operaciones, evitando accesos no autorizados.

# #Licencia
Este proyecto se encuentra bajo la licencia `MIT`. Consulta el archivo LICENSE para más información.

### Galería de Imagenes del Sistema

<div align="center">
  <img src="https://github.com/user-attachments/assets/c0637123-2ea8-4997-b893-4c5cddea840d" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/82f0557b-0be0-4eae-b08f-57ee775076ef" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/16b40dbf-5a33-475c-b57b-ead5a24ee6b1" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/c7aa78bb-7eb7-4221-a0d5-3f8e99e6e69c" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/1590d566-f378-4447-ab93-194a995dab32" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/f4d163d8-5e81-4d76-8dfd-75864b69d4b9)
21-a0d5-3f8e99e6e69c" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <img src="https://github.com/user-attachments/assets/65cf2687-e1e2-46c6-a54a-5f3fe3c35b5c" alt="Imagen del Sistema" width="250" style="margin:10px;" />
  <!-- Puedes agregar más imágenes siguiendo el mismo patrón -->
</div>
