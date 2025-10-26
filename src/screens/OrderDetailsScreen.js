import React, { useEffect, useState } from "react";
import { Card, ListGroup, Button, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetailsScreen = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const userSelector = useSelector((state) => state.user);
  const { user } = userSelector;

  useEffect(() => {
    // Simulate an API call to fetch the order details by orderId
    const fetchOrderDetails = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
      };
      const orderDetailsResponse = await axios.get(
        `https://vercel-django-eosin.vercel.app/api/orders/${id}`,
        config
      );
      setOrder(orderDetailsResponse.data);
    };

    fetchOrderDetails();
  }, []);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="order-details container mt-4">
      <Card>
        <Card.Body>
          <Card.Title className="card-title-custom text-center mb-4">
            Order #{order.id}
          </Card.Title>

          {/* Order Information */}
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Tax Price:</strong> ${order.taxPrice}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Shipping Price:</strong> ${order.shippingPrice}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Price:</strong> ${order.totalPrice}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Is Paid:</strong> {order.isPaid ? "Yes" : "No"}
                </ListGroup.Item>
                {order.isPaid && (
                  <ListGroup.Item>
                    <strong>Paid At:</strong>{" "}
                    {new Date(order.paidAt).toLocaleString()}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Is Delivered:</strong>{" "}
                  {order.isDelivered ? "Yes" : "No"}
                </ListGroup.Item>
                {order.isDelivered && (
                  <ListGroup.Item>
                    <strong>Delivered At:</strong>{" "}
                    {new Date(order.deliveredAt).toLocaleString()}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Order Created At:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Shipping Address */}
          <Card.Subtitle className="card-title-custom mt-4 mb-3 text-center">
            Shipping Address
          </Card.Subtitle>
          <ListGroup variant="flush">
            <ListGroup.Item>{order.address}</ListGroup.Item>
            <ListGroup.Item>
              {order.city}, {order.postalCode}
            </ListGroup.Item>
            <ListGroup.Item>{order.country}</ListGroup.Item>
          </ListGroup>

          {/* Order Items */}
          <Card.Subtitle className="card-title-custom mt-4 mb-3 text-center">
            Order Items
          </Card.Subtitle>
          <ListGroup variant="flush">
            {order.order_items.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={3}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={9}>
                    <strong>{item.name}</strong>
                    <p>Quantity: {item.qty}</p>
                    <p>Price: ${item.price}</p>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Mark as Delivered Button */}
          <div className="text-center mt-4">
            <Button size="md" disabled={order.isDelivered}>
              {order.isDelivered ? "Already Delivered" : "Mark as Delivered"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderDetailsScreen;
