import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad.js";
import { FaBoxes } from "react-icons/fa";

import "./stylepages.css";
import Skeleton from "../../components/skeletons/Skeleton.jsx";
import SkeletonText from "../../components/skeletons/SkeletonText.jsx";

const StockSmart = lazyLoad(
  "../components/admin/stocks/StockSmart",
  "StockSmart"
);
const GradualSpacing = lazy(
  () => import("../../components/shared/magic_ui/GradualSpacing.jsx")
);

export const Stocks = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
        <Suspense fallback={<h2>Stock en Tienda</h2>}>
          <div
            style={{ fontSize: "40px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <FaBoxes />
          </div>
          <GradualSpacing text="Stock en Tienda" className="m-0" type="h2" />
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
        <StockSmart />
      </Suspense>
    </section>
  );
};
