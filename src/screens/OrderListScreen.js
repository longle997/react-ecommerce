import React from "react";
import { listOrders } from "../actions/orderActions";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";

function OrderListScreen() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const orderListSelector = useSelector((state) => state.orderList);
  const { orders, loading, error } = orderListSelector;
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  // this function aim to reverse value for sortConfig state
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // this function is aim to the orders list by using sortConfig state
  const getSortedData = () => {
    let sortedData = [];
    if (orders !== undefined) {
      sortedData = [...orders].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData;
  };

  // this function aim to filter the orders list after it being sorted
  const filteredOrders = getSortedData().filter(
    (order) =>
      order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.totalPrice.toString().includes(searchTerm) ||
      order.taxPrice.toString().includes(searchTerm)
  );

  // if error occurse => return error message component
  if (error !== null && error !== undefined)
    return (
      <Message variant="danger">
        <h3>Could not fetch order error! Please try later</h3>
      </Message>
    );

  // this function will check the sortConfig.direction then render appropriate arrow
  const renderArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? (
        <i className="fas fa-arrow-up" />
      ) : (
        <i className="fas fa-arrow-down" />
      );
    }
    return null;
  };

  function handleDetails(orderId) {
    // always include the prefix / at the beginning of the url in order to specify the absolute url
    navigate(`/orders/${orderId}`);
  }

  return (
    <div className="order-list container mt-4">
      {loading ? (
        <Loader></Loader>
      ) : (
        <div>
          <h2 className="text-center mb-4">Order List</h2>

          {/* Search bar */}
          <Form.Group controlId="searchBar" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search by Payment Method or Total Price"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {/* Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  style={{ cursor: "pointer" }}
                >
                  Order ID {renderArrow("id")}
                </th>
                <th
                  onClick={() => handleSort("paymentMethod")}
                  style={{ cursor: "pointer" }}
                >
                  Payment Method {renderArrow("paymentMethod")}
                </th>
                <th
                  onClick={() => handleSort("taxPrice")}
                  style={{ cursor: "pointer" }}
                >
                  Tax Price {renderArrow("taxPrice")}
                </th>
                <th
                  onClick={() => handleSort("shippingPrice")}
                  style={{ cursor: "pointer" }}
                >
                  Shipping Price {renderArrow("shippingPrice")}
                </th>
                <th
                  onClick={() => handleSort("totalPrice")}
                  style={{ cursor: "pointer" }}
                >
                  Total Price {renderArrow("totalPrice")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.taxPrice}</td>
                  <td>{order.shippingPrice}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    <Button onClick={(e) => handleDetails(order.id)}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;
