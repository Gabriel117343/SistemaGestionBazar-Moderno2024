import { renderHook } from '@testing-library/react-hooks';
import useTransformarDatosVenta from '../src/hooks/useTransformarDatosVenta';

// Test para verificar que useTransformarDatosVenta maneja correctamente productos únicos
test('useTransformarDatosVenta returns expected data for unique products', () => {
  const carrito = [
    {
      id: 1,
      tipo: { id: 1 }, 
      proveedor: { id: 1 }, 
      cantidad: 2,
      precio: '10.00',
    },
    {
      id: 2,
      tipo: { id: 2 }, 
      proveedor: { id: 2 }, 
      cantidad: 1,
      precio: '20.00',
    },
  ];

  // Renderiza el hook y obtiene el resultado
  const { result } = renderHook(() => useTransformarDatosVenta()(carrito));

  // Desestructura los datos transformados
  const [infoTipo, infoProducto, infoProveedor] = result.current;

  // Verifica que la información de tipos es correcta
  expect(infoTipo).toEqual({
    tipo: [
      { entidad_id: 1, cantidad: 2, total: 20.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });

  // Verifica que la información de productos es correcta
  expect(infoProducto).toEqual({
    producto: [
      { entidad_id: 1, cantidad: 2, total: 20.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });

  // Verifica que la información de proveedores es correcta
  expect(infoProveedor).toEqual({
    proveedor: [
      { entidad_id: 1, cantidad: 2, total: 20.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });
});

// Test para verificar que useTransformarDatosVenta maneja correctamente productos repetidos
test('useTransformarDatosVenta returns expected data for repeated products', () => {
  const carrito = [
    {
      id: 1,
      tipo: { id: 1 }, 
      proveedor: { id: 1 }, 
      cantidad: 2,
      precio: '10.00',
    },
    {
      id: 1,
      tipo: { id: 1 },
      proveedor: { id: 1 }, 
      cantidad: 3,
      precio: '10.00',
    },
  ];

  // Renderiza el hook y obtiene el resultado
  const { result } = renderHook(() => useTransformarDatosVenta()(carrito));

  // Desestructura los datos transformados
  const [infoTipo, infoProducto, infoProveedor] = result.current;

  // Verifica que la información de tipos es correcta
  expect(infoTipo).toEqual({
    tipo: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
    ],
  });

  // Verifica que la información de productos es correcta
  expect(infoProducto).toEqual({
    producto: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
    ],
  });

  // Verifica que la información de proveedores es correcta
  expect(infoProveedor).toEqual({
    proveedor: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
    ],
  });
});

// Test para verificar que useTransformarDatosVenta maneja correctamente una mezcla de productos únicos y repetidos
test('useTransformarDatosVenta returns expected data for mixed products', () => {
  const carrito = [
    {
      id: 1,
      tipo: { id: 1 }, 
      proveedor: { id: 1 }, 
      cantidad: 2,
      precio: '10.00',
    },
    {
      id: 2,
      tipo: { id: 2 }, 
      proveedor: { id: 2 }, 
      cantidad: 1,
      precio: '20.00',
    },
    {
      id: 1,
      tipo: { id: 1 }, 
      proveedor: { id: 1 },  
      cantidad: 3,
      precio: '10.00',
    },
  ];

  // Renderiza el hook y obtiene el resultado
  const { result } = renderHook(() => useTransformarDatosVenta()(carrito));

  // Desestructura los datos transformados
  const [infoTipo, infoProducto, infoProveedor] = result.current;

  // Verifica que la información de tipos es correcta
  expect(infoTipo).toEqual({
    tipo: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });

  // Verifica que la información de productos es correcta
  expect(infoProducto).toEqual({
    producto: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });

  // Verifica que la información de proveedores es correcta
  expect(infoProveedor).toEqual({
    proveedor: [
      { entidad_id: 1, cantidad: 5, total: 50.0 },
      { entidad_id: 2, cantidad: 1, total: 20.0 },
    ],
  });
});