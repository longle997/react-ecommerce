import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import AdminScreenUsers from "./AdminScreenUsers";

function AdminScreen() {
  const location = useLocation();
  return (
    <div>
      <Nav className="justify-content-center mb-4" variant="pills">
        <Nav.Item key="admin-user">
          <Nav.Link as={Link} to="/admin/user">
            USERS
          </Nav.Link>
        </Nav.Item>
        <Nav.Item key="admin-product">
          <Nav.Link as={Link} to="/admin/product">
            PRODUCTS
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default AdminScreen;
