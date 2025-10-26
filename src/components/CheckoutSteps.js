// CheckoutSteps.tsx
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const defaultPaths = {
  step1: "/cart",
  step2: "/shipping",
  step3: "/payment",
  step4: "/placeorder",
};

export default function CheckoutSteps({
  step1 = null,
  step2 = null,
  step3 = null,
  step4 = null,
  paths = defaultPaths,
}) {
  const location = useLocation();
  //!!step1 is a quick JavaScript trick to coerce any value into a real boolean (true or false).
  //<CheckoutSteps step1 paths={{ step1: "/cart" }}></CheckoutSteps> => step1 will be true
  const items = [
    { key: "step1", label: "Cart", enabled: !!step1, to: paths.step1 },
    { key: "step2", label: "Shipping", enabled: !!step2, to: paths.step2 },
    { key: "step3", label: "Payment", enabled: !!step3, to: paths.step3 },
    { key: "step4", label: "Place Order", enabled: !!step4, to: paths.step4 },
  ];

  return (
    <Nav className="justify-content-center mb-4" variant="pills">
      {items.map(({ key, label, enabled, to }) => {
        // check is the current path match the item's path
        const isActive = location.pathname === to;
        // Loop through all the item, if current path match item's path => render active link, otherwise render disabled link
        return (
          <Nav.Item key={key}>
            {enabled ? (
              <Nav.Link as={Link} to={to} active={isActive}>
                {label}
              </Nav.Link>
            ) : (
              <Nav.Link disabled>{label}</Nav.Link>
            )}
          </Nav.Item>
        );
      })}
    </Nav>
  );
}
