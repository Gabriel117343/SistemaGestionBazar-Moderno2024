import { useRef } from 'react';
import { debounce } from 'lodash';
// CUSTOM HOOK reutilizable para refrescar datos con un debounce
export default function useRefreshDebounce(func, wait) {
  const isFirstCall = useRef(true); // es la primera Llamada

  const debouncedFunc = debounce(func, wait);

  return () => {
    if (isFirstCall.current) {
      func();
      isFirstCall.current = false;
    } else {
      debouncedFunc();
    }
  };
}