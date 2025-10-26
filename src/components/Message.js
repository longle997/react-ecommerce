import React from "react";
import { Alert } from "react-bootstrap";

// In React, children is a special prop that allows you to pass content or elements between the opening and closing tags of a component.
// children is a special, built-in prop in React that automatically receives content between the opening and closing tags of a component
function Message({ variant, children }) {
  return (
    <Alert className="text-center" variant={variant}>
      {children}
    </Alert>
  );
}

export default Message;
