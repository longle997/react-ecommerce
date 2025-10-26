import {
  Container,
  Row,
  Col,
  Form,
  Toast,
  ToastContainer,
  Button,
} from "react-bootstrap";
import { userLogin } from "../actions/UserAction";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function LoginScreen() {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { user, error, loading } = userSelector;
  // const user = userSelector !== null ? userSelector.user : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null && user !== undefined) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    // if (error !== null && error !== undefined) setShowPopup(true);
    if (error !== null && error !== undefined) setShow(true);
  }, [error]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  // const [showPopup, setShowPopup] = useState(false);
  // Close the popup
  // const closePopup = () => {
  //   setShowPopup(false);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Both fields are required!");
    } else {
      // Simulate successful login (this should be replaced with actual logic)
      console.log("Logged in with:", { username, password });
      dispatch(userLogin(username, password));
      // Redirect to home page or dashboard after login
    }
  };
  return (
    <div>
      {/* <Popup show={showPopup} closePopup={closePopup}>
        <h4>{error}</h4>
      </Popup>
      */}
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
              <Col md={4}>
                <h3 className="text-center">Login</h3>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <br></br>
                  <Button variant="primary" type="submit" block="true">
                    Login
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
}

export default LoginScreen;
