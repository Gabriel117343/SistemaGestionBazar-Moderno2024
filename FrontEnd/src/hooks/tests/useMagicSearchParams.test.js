import { renderHook, act } from '@testing-library/react-hooks';
import { useMagicSearchParams } from '../useMagicSearchParams';
import { useSearchParams } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

describe('useMagicSearchParams', () => {
  let mockSearchParams;
  let mockSetSearchParams;

  beforeEach(() => {
    mockSearchParams = new URLSearchParams('page=1&pageSize=10&filter=test');
    mockSetSearchParams = vi.fn();
    useSearchParams.mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  test('obtenerParametros retorna los parámetros correctos', () => {
    const mandatory = { page: 1, pageSize: 10 };
    const optional = { filter: '', category: 'all' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    const params = result.current.obtenerParametros();

    expect(params).toEqual({
      page: 1,
      pageSize: 10,
      filter: 'test',
    });
  });

  test('actualizarParametros actualiza los parámetros correctamente', () => {
    const mandatory = { page: 1, pageSize: 10 };
    const optional = { filter: '', category: 'all' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    act(() => {
      result.current.actualizarParametros({
        newParams: { filter: 'newFilter', category: 'electronics' },
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      filter: 'newFilter',
      category: 'electronics',
    });
  });

  test('limpiarParametros restablece los parámetros a los obligatorios', () => {
    const mandatory = { page: 1, pageSize: 10 };
    const optional = { filter: '', category: 'all' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    act(() => {
      result.current.limpiarParametros({ mantenerParamsUrl: false });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });
  });
  test('calcularParametrosOmitidos maneja correctamente los parámetros omitidos', () => {
    const mandatory = { page: 1, pageSize: 10 };
    const optional = { filter: '', category: 'all' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    act(() => {
      result.current.actualizarParametros({
        newParams: { filter: 'newFilter' },
        keepParams: { category: false },
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      filter: 'newFilter',
    });
  });
  test('actualizarParametros no actualiza los parámetros cuando no se envían nuevos parámetros ni parámetros a mantener', () => {
    const mandatory = { page: '1', pageSize: '10' };
    const optional = { filter: '', category: 'all' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    act(() => {
      result.current.actualizarParametros();
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '1',
      pageSize: '10', // siempre se convierten a string por lo que no se espera su valor como número entero a diferencia de obtenerParametros()
    });
  });
  test('calcularParametrosOmitidos maneja correctamente los parámetros omitidos', () => {
    const mandatory = { page: 1, pageSize: 10 };
    const optional = { filter: '', category: 'Tecnologia' };

    const { result } = renderHook(() => useMagicSearchParams({ mandatory, optional }));

    act(() => {
      result.current.actualizarParametros({
        newParams: { filter: 'newFilter' },
        keepParams: { category: false },
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      filter: 'newFilter',
    });
  });
  
});
