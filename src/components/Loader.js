import React from "react";
import { Container, Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Container className="text-center">
      <Spinner
        animation="border"
        role="status"
        style={{
          height: "100px",
          width: "100px",
          margin: "auto",
          display: "block",
        }}
      ></Spinner>
      <span className="sr-only">Loading...</span>
    </Container>
  );
}

export default Loader;
