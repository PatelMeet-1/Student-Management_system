import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Loader = ({
  height = "100",
  width = "100",
  color = "#4fa94d",
}) => {
  return (
    <div
      style={{
        position: "fixed",      
        top: 0,
        left: 0,
        width: "100vw",          // poora width
        height: "100vh",         // poora height
        background: "rgba(0,0,0,0.3)", // semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,            // sab ke upar
      }}
    >
      <CirclesWithBar
        height={height}
        width={width}
        color={color}
        outerCircleColor={color}
        innerCircleColor={color}
        barColor={color}
        ariaLabel="circles-with-bar-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
