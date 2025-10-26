import React from "react";
import { listOrders } from "../actions/orderActions";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";

function SearchBar({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState("");
  //   const productListSelector = useSelector((state) => state.productList);
  //   const {products} = productListSelector
  // this function aim to filter the products list
  useEffect(() => {
    setProducts(products);
  }, []);
  function handleSearchBarChange(value) {
    setSearchTerm(value);
    const productsFiltered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setProducts(productsFiltered);
  }

  return (
    <div>
      <Form.Group controlId="searchBar" className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by product's name"
          value={searchTerm}
          onChange={(e) => handleSearchBarChange(e.target.value)}
        />
      </Form.Group>
    </div>
  );
}

export default SearchBar;
