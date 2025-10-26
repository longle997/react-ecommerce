// Import necessary modules from React and React-Bootstrap
import React, { useState } from "react";
import { Image, Card } from "react-bootstrap"; // We'll use Bootstrap Image & Card for styling

// Define the component that receives `product` data as a prop
export default function ProductHoverInfo({ product }) {
  // useState hook controls whether the popup (tooltip card) is visible
  const [open, setOpen] = useState(false);

  // Prepare a shortened version of the description (max 120 chars)
  // This avoids overly long text in the small popup
  const shortDesc =
    product.description.length > 120
      ? product.description.slice(0, 117) + "..."
      : product.description;

  return (
    // Outer wrapper for image + popup
    // position: relative → allows us to position the popup absolutely inside it
    // display: inline-block → makes it wrap tightly around the image
    <div
      className="hover-wrapper"
      style={{ position: "relative", display: "inline-block" }}
      // When mouse hovers in → show popup
      onMouseEnter={() => setOpen(true)}
      // When mouse leaves → hide popup
      onMouseLeave={() => setOpen(false)}
      // When keyboard focuses (Tab navigation) → show popup
      onFocus={() => setOpen(true)}
      // When focus leaves → hide popup
      onBlur={() => setOpen(false)}
      // tabIndex=0 makes this div focusable for keyboard users
      tabIndex={0}
    >
      {/* ✅ The main product image (your existing Bootstrap <Image> component) */}
      <Image
        src={product.image} // image URL from backend
        alt={product.name} // alt text for accessibility
        className="img-thumbnail border border-2 rounded object-fit-cover"
        style={{
          width: "300px", // set fixed width
          height: "250px", // set fixed height (same 640:510 ratio)
          objectFit: "cover", // crop edges to fill box without distortion
        }}
        fluid // Makes image responsive (Bootstrap prop)
      />

      {/* ✅ Popup card appears only when open == true */}
      {open && (
        // Bootstrap Card component styled as a tooltip popup
        <Card
          className="shadow border-0 product-hover-popup"
          style={{
            position: "absolute", // Position relative to wrapper div
            bottom: "calc(100% + 8px)", // Show above image with 8px gap
            left: 0,
            right: 0,
            margin: "0 auto", // Center horizontally
            width: "200%", // Match width of image
            maxWidth: "400px", // Prevent too wide on large screens
            zIndex: 50, // Ensure popup stays above other elements
          }}
        >
          {/* Inner content of the popup card */}
          <Card.Body className="p-3">
            {/* Product name, bold, truncated if too long */}
            <Card.Title
              as="h6"
              className="fw-bold mb-2 text-truncate" // Truncate long names
              title={product.name} // Show full name on hover (browser tooltip)
            >
              {product.name}
            </Card.Title>

            {/* Optional brand displayed below the title */}
            <Card.Subtitle className="mb-2 text-muted">
              {product.brand}
            </Card.Subtitle>

            {/* Price + stock info row */}
            <Card.Text className="small mb-2">
              {/* Price in bold green */}
              <strong>${product.price.toFixed(2)}</strong> ·{" "}
              {/* Show stock status in green or red */}
              {product.countInStock > 0 ? (
                <span className="text-success">In Stock</span>
              ) : (
                <span className="text-danger">Out of Stock</span>
              )}
            </Card.Text>

            {/* Product rating section (if available) */}
            <Card.Text className="text-muted small mb-2">
              {/* Show stars and number of reviews */}⭐{" "}
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </Card.Text>

            {/* Short description (clamped to 3 lines) */}
            <Card.Text
              className="text-muted small mb-0"
              style={{
                display: "-webkit-box", // for line clamping
                WebkitLineClamp: 3, // limit to 3 lines
                WebkitBoxOrient: "vertical",
                overflow: "hidden", // hide overflow text
              }}
            >
              {shortDesc}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
