// screens/PaymentScreen.jsx
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps"; // optional if you use it
import { addPaymentMethod } from "../actions/CartAction";
import { useDispatch, useSelector } from "react-redux";

const METHODS = ["PayPal", "Stripe", "COD", "BankTransfer"];

export default function PaymentScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartSelector = useSelector((state) => state.cart);
  const { paymentMethod } = cartSelector;
  const [paymentMethodState, setPaymentMethodState] = useState(null);

  // (Optional) enforce shipping first
  useEffect(() => {
    // const hasShipping = !!localStorage.getItem("shippingAddress");
    // if (!hasShipping) navigate("/shipping");
    setPaymentMethodState(paymentMethod);
  }, [navigate]);

  function submitHandler(e) {
    e.preventDefault();
    dispatch(addPaymentMethod(paymentMethodState));
    // If using Redux: dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  function labelOf(m) {
    if (m === "PayPal") return "PayPal / Credit Card";
    if (m === "Stripe") return "Stripe";
    if (m === "COD") return "Cash on Delivery";
    if (m === "BankTransfer") return "Bank Transfer";
    return m;
  }

  return (
    <div>
      {/* Remove if you don't use stepper */}
      <CheckoutSteps step1 step2 step3 />

      <h1 className="mb-3">Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-4">
          {METHODS.map((m) => (
            <Form.Check
              key={m}
              type="radio"
              id={`pay-${m.toLowerCase()}`}
              label={labelOf(m)}
              name="paymentMethod"
              value={m}
              checked={paymentMethodState === m}
              onChange={(e) => setPaymentMethodState(e.currentTarget.value)}
              className="mb-2"
            />
          ))}
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Continue
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/shipping")}
          >
            Back
          </Button>
        </div>
      </Form>
    </div>
  );
}
