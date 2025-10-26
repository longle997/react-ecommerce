import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

function Header() {
  const userSelector = useSelector((state) => state.user);
  const { user, loading, error } = userSelector;
  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>PROSHOP</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i>CART
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <Nav.Link>
                    <i className="fa-solid fa-bag-shopping"></i>ORDER
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/user">
                  <Nav.Link>
                    <i className="fas fa-user"></i>
                    {user ? user.name : "USER"}
                  </Nav.Link>
                </LinkContainer>
                {/* user?.isAdmin prevents runtime errors when user is undefined. */}
                {user?.isAdmin && (
                  <LinkContainer to="/admin/user">
                    <Nav.Link>
                      <i className="fas fa-user-tie"></i>
                      ADMIN PAGE
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}

export default Header;
