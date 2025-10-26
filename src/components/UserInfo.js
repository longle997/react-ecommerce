import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { userLogout, userUpdateInfo } from "../actions/UserAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";

const UserInfo = () => {
  const userSelector = useSelector((state) => state.user);
  const { user, error, loading } = userSelector;
  // Initial user data (can be fetched from an API or passed in as props)
  const initialUserInfo = {
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    password: "",
  };

  // State for user info and edit mode
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [emailValid, setEmailValid] = useState(true); // Track email validity
  const dispatch = useDispatch();

  useEffect(() => {
    // if (error !== null && error !== undefined) setShowPopup(true);
    if (error !== null && error !== undefined) setShow(true);
  }, [error]);

  // Handler to toggle the edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handler for saving the edited user info
  const handleSave = () => {
    setIsEditing(false);
    console.log("User info saved:", userInfo);
    dispatch(userUpdateInfo(userInfo.name, userInfo.email, userInfo.password));
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email); // Return true or false based on regex match
  };

  // Handler for input change (updates state)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
    // Inline email validation on change
    if (name === "email") {
      setEmailValid(validateEmail(value)); // Validate email format
    }
  };

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <div>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div>
          <ToastContainer position="top-end">
            <Toast
              bg="danger"
              show={show}
              onClose={() => setShow(false)}
              delay={3000}
              autohide
            >
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Container className="mt-5">
            <Row className="justify-content-md-center">
              <Col md={6}>
                <h3 className="text-center">User Information</h3>

                <Form>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={userInfo.name}
                        disabled
                      />
                    )}
                  </Form.Group>

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    {isEditing ? (
                      <div>
                        <Form.Control
                          type="email"
                          name="email"
                          value={userInfo.email}
                          onChange={handleChange}
                          isInvalid={!emailValid}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid email address.
                        </Form.Control.Feedback>
                      </div>
                    ) : (
                      <Form.Control
                        type="email"
                        value={userInfo.email}
                        disabled
                      />
                    )}
                  </Form.Group>

                  {isEditing && (
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>

                      <Form.Control
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}

                  <Form.Group controlId="formPhone">
                    <Form.Label>is Admin</Form.Label>
                    <Form.Check
                      type="Checkbox"
                      checked={userInfo.isAdmin}
                      disabled
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant={isEditing ? "success" : "primary"}
                      onClick={toggleEdit}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    {isEditing ? (
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!emailValid}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button onClick={handleLogout}>Logout</Button>
                    )}
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
