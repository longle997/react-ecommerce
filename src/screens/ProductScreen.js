import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Image,
  Container,
  ListGroup,
  Card,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";
import { useState, useEffect } from "react";
import { detailsProduct } from "../actions/ProductAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  /*
    [] dependencies:

    The second argument to useEffect is an array of dependencies ([dispatch, id]).

    dispatch: The dispatch function itself doesn't change, but we include it here because it’s recommended to add it as a dependency when using Redux with useDispatch().

    id: This is the product ID extracted from the URL via useParams(). Whenever id changes, the effect will re-run to fetch the new product’s data. This ensures that if the user navigates to a different product (with a new id), the component will fetch and display the correct product data.
  */
  useEffect(() => {
    /*
      // If the user navigates away (or id changes) before the request finishes, the old request may still resolve. Without a guard, you’d call setProduct(...) on a component that’s already unmounted or showing a newer product—React will warn (“Can’t perform a React state update on an unmounted component”) and you risk subtle bugs.
      let ignore = false;

      setLoading(true);
      axios
        .get(`https://vercel-django-eosin.vercel.app/api/products/${id}`)
        .then((res) => {
          if (!ignore) setProduct(res.data); // only update if this effect is still “current”
        })
        .catch((err) => {
          if (!ignore) setError(err.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });

      return () => {
        ignore = true; // mark this effect as obsolete
      };
    */
    dispatch(detailsProduct(id));
  }, [dispatch, id]);

  function handleAddToCart(e) {
    navigate(`/cart/${id}?qty=${qty}`);
    // history.push(`https://vercel-django-eosin.vercel.app/api/products`);
  }

  if (loading) return <Loader></Loader>;
  if (error) return <Message message={error} variant="danger"></Message>;
  if (!product) return <p>Not found</p>;

  return (
    <Container>
      <Link to="/" className="btn btn-light my-3">
        Go back
      </Link>
      <Row>
        <Col md={5}>
          <Image
            src={product.image}
            alt={product.name}
            className="img-thumbnail border border-2 rounded"
            fluid
          ></Image>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h2>{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: <strong>${product.price}</strong>
            </ListGroup.Item>
            <ListGroup.Item>{product.description}</ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
                color="#f8e825"
              ></Rating>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className="border border-2 rounded">
            <Card.Body className="p-0">
              <Table bordered hover size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <th className="w-50">Status</th>
                    <td>
                      {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                    </td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>${product.price}</td>
                  </tr>
                  {product.countInStock > 0 ? (
                    <tr>
                      <th>Quantity</th>
                      <td>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          id="addCartForm"
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    {/* Make the button span the full table width */}
                    <td colSpan={2} className="p-2">
                      <Button
                        onClick={(e) => handleAddToCart(e)}
                        type="button"
                        className="w-100"
                        disabled={product.countInStock === 0}
                      >
                        ADD TO CART
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductScreen;
