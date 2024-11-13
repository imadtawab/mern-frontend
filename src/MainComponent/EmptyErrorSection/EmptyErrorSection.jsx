import React from "react";
import emptySvg from "../../Assets/empty.png"
export default function EmptyErrorSection() {
  return (
    <div style={{    display: "grid",
        placeContent: "center",
        height: "330px",
        overflow: "hidden",
        background: "var(--white-color)"}} className="EmptyErrorSection">
      <img loading='lazy' style={{width: "400px", maxWidth: "100%",
    height: "auto"}} src={emptySvg} alt="" />
    </div>
  );
}
