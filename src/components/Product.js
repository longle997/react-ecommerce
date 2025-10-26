import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import ProductHoverInfo from "../components/ImageHoverDetails";

function Product({ product }) {
  return (
    <div>
      {/* Using Card saves you from writing raw <div class="card">...</div> plus nested card elements. */}
      <Card className="my-3 p-3 rounded">
        {/* <a href> triggers a full refresh; <Link to> changes the URL without reloading, which is smoother. */}
        <Link to={`/products/${product._id}`}>
          <div className="p-3 text-center">
            <ProductHoverInfo product={product} />
          </div>
        </Link>

        {/* Card.Body is the content section inside the card.

            Card.Text is a react-bootstrap component for text inside cards.

            The prop as="div" tells react-bootstrap to render Card.Text as a <div> tag instead of the default <p>. This is a common pattern in react-bootstrap: many components let you change the underlying tag with as.
        */}
        <Card.Body>
          <Link to={`/products/${product._id}`}>
            <Card.Title>
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <Rating
              value={product.rating}
              color={"#f8e825"}
              text={`${product.numReviews} reviews`}
            ></Rating>
          </Card.Text>

          <Card.Text as="h3">${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Product;
