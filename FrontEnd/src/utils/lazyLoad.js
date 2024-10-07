import { lazy } from "react";

export function lazyLoad(path, nameExport) {
  
  return lazy(() => {
    const promise = import(/* @vite-ignore */ path);
    if (nameExport === null) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[nameExport] }));
    }
  });
}
