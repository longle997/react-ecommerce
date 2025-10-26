import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addCartShippingAddress } from "../actions/CartAction";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";

const ShippingScreen = () => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const cartSelector = useSelector((state) => state.cart);
  const { shippingAddress, loading, error } = cartSelector;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch existing shipping info
  useEffect(() => {
    if (shippingAddress !== null) {
      setFormData({ ...shippingAddress });
    }
  }, [shippingAddress]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCartShippingAddress(formData));
    navigate("/payment");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <CheckoutSteps
        step1
        step2
        paths={{ step1: "/cart", step2: "/shipping" }}
      ></CheckoutSteps>
      <h1 className="text-center">SHIPPING ADDRESS</h1>
      <Form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Form.Group controlId="formAddress" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </Form.Group>

        <Form.Group controlId="formCity" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
        </Form.Group>

        <Form.Group controlId="formPostalCode" className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
          />
        </Form.Group>

        <Form.Group controlId="formCountry" className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default ShippingScreen;
