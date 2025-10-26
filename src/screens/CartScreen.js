import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCard, removeFromCart } from "../actions/CartAction";
import CheckoutSteps from "../components/CheckoutSteps";

function CartScreen({ history }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParam = new URLSearchParams(location.search);
  const qty = searchParam.get("qty") ? Number(searchParam.get("qty")) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (id) {
      dispatch(addToCard(id, qty));
    }
  }, [dispatch, id, qty]);

  function removeFromCartHandler(productID) {
    dispatch(removeFromCart(productID));
    navigate("/cart");
  }

  function addToCartHandler(id, qty) {
    dispatch(addToCard(id, qty));
    navigate("/cart");
  }

  function checkoutHandler() {
    navigate("/shipping");
  }

  return (
    <div>
      <CheckoutSteps step1 paths={{ step1: "/cart" }}></CheckoutSteps>
      <h1 className="text-center">SHOPPING CART</h1>
      {cart.cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty <Link to="/">Go Back</Link>
        </Message>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              {cart.cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/products/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>Price: ${item.price}</Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item.product, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              {/* The variant="flush" prop ensures that the list items have no borders or padding, meaning they "flush" with the edges of the parent container (creating a cleaner design). */}
              <ListGroup variant="flush">
                <ListGroup.Item>
                  {/* array.reduce(function(total, currentValue, currentIndex, arr), initialValue) */}
                  <h2>
                    Subtotal (
                    {cart.cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    Items
                  </h2>
                  $
                  {cart.cartItems
                    .reduce((acc, item) => acc + item.price * item.qty, 0)
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    onClick={checkoutHandler}
                  >
                    Process to checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CartScreen;
