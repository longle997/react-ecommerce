import React from "react";

function Rating({ value, text, color }) {
  return (
    <div>
      {/*   <span> is used to group and align the rating inline and to provide a styling/accessibility hook.

            <i> is a long-standing convention for Font Awesome icons; the classes on it determine full/half/empty stars. It could be a <span> too—the classes are what matter. 

            Use padding when you want more breathing room inside the component (e.g., make a button bigger without moving it).

            Use margin when you want to control the spacing between components (e.g., distance between cards or paragraphs).

            Want bigger touch target? → Padding

            Want distance from neighbors? → Margin

            Need background to extend into the spacing? → Padding

            Need transparent gap outside? → Margin
        */}

      <span className="rating">
        <i
          style={{ color }}
          className={
            value >= 1
              ? "fas fa-star"
              : value >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
        <i
          style={{ color }}
          className={
            value >= 2
              ? "fas fa-star"
              : value >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
        <i
          style={{ color }}
          className={
            value >= 3
              ? "fas fa-star"
              : value >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
        <i
          style={{ color }}
          className={
            value >= 4
              ? "fas fa-star"
              : value >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
        <i
          style={{ color }}
          className={
            value >= 5
              ? "fas fa-star"
              : value >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>{text ? text : ""}</span>
    </div>
  );
}

export default Rating;
