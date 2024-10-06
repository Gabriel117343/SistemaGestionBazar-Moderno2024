import React from "react";
import "./skeleton.css";

const SkeletonCircle = ({ size = "100px" }) => {
  return (
    <div
      className="skeleton"
      style={{
        height: size,
        width: size,
        borderRadius: "50%",
      }}
    ></div>
  );
};

export default SkeletonCircle;
