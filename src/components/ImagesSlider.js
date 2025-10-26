import React from "react";
import { Carousel } from "react-bootstrap";

export default function ProductCarousel({ images }) {
  const imageHeight = 400; // set the fixed height for all slides (px)

  return (
    <Carousel
      fade
      interval={10000}
      pause="hover"
      indicators={true}
      className="product-carousel"
    >
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <div
            style={{
              width: "100%",
              height: `${imageHeight}px`,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f9fa", // light gray background (optional)
            }}
          >
            <img
              src={image}
              alt={`slide-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // fill box evenly (cropping if needed)
              }}
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
