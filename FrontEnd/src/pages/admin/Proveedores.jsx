import { lazy, Suspense } from "react";
import { lazyLoad } from "../../utils/lazyLoad";

import { BsPersonVcardFill } from "react-icons/bs";

import Skeleton from "../../components/skeletons/Skeleton";
import SkeletonText from "../../components/skeletons/SkeletonText";

const GradualSpacing = lazy(
  () => import("../../components/shared/magic_ui/GradualSpacing.jsx")
);
const ListaProveedoresContenedor = lazyLoad(
  "../components/admin/proveedores/ListaProveedoresContenedor",
  "ListaProveedoresContenedor"
);

import "./stylepages.css";
export const Proveedores = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
        <Suspense fallback={<h2>Proveedores</h2>}>
          <div
            style={{ fontSize: "35px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <BsPersonVcardFill />
          </div>
          <GradualSpacing text="Proveedores" className="m-0" type="h2" />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <>
            <SkeletonText lines={2} gap="8px" />
            <Skeleton height="500px" width="100%" />
          </>
        }
      >
        <ListaProveedoresContenedor />
      </Suspense>
    </section>
  );
};
