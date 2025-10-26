import { Row, Col, Form } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import { listProducts } from "../actions/ProductAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "../components/ImagesSlider";
import axios from "axios";
import PaginationSimple from "../components/Pagination";

/*
WORKFLOW
Here’s the flow of how Redux updates the state:

The useEffect hook dispatches the listProducts() action when the component mounts.

listProducts() triggers an asynchronous operation (such as an API call) to fetch product data.

Once the data is fetched:

The Redux action updates the Redux store with the new products list (through a reducer).

If there was an error, the Redux store is updated with the error message.

When the state is updated, React-Redux’s useSelector hook will automatically trigger a re-render of the component with the new state.
*/

function HomeScreen() {
  //useDispatch: This hook provides access to the dispatch function, allowing you to send actions to Redux (in this case, to fetch the product list).
  const dispatch = useDispatch();
  // useSelector: Here, you're accessing the Redux state to get productList. This is pulling from the productList state that’s likely managed by Redux, which contains:
  // useSelector accepts a selector function. This function receives the entire Redux state as an argument
  // Example of selector function
  // function productListSelectorFunction(state) {
  //   return state.productList
  // }
  // const productList = useSelector(productListSelectorFunction);
  // const productList = useSelector((state) => state.productList);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    count: 0,
    results: [],
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");

  // Set this to your DRF PAGE_SIZE for correct page count
  const PAGE_SIZE = 8; // ← change if your backend uses a different size

  const fetchPage = async (p) => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        "https://vercel-django-eosin.vercel.app/api/products/",
        { params: { page: p } }
      );
      setData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  /*
    useEffect: This hook runs after the component has mounted (i.e., rendered for the first time).
    Here, it’s used to trigger the product list fetch by dispatching the listProducts() action.
    The useEffect hook will run only once (on component mount) because the dependency array ([dispatch]) contains only dispatch, which doesn't change.
  */
  useEffect(() => {
    // useEffect: This hook runs after the component mounts. Here, it will dispatch the listProducts() action to fetch the products as soon as the component is rendered for the first time.
    // What happens when dispatch(listProducts()) is called? listProducts() is called. The function returns a thunk function that gets executed.
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.post(
        "https://vercel-django-eosin.vercel.app/api/images/",
        { folder: "banners" }
      );
      const images = response.data.results.map((image) => image["url"]);
      setImages(images);
    };
    fetchImages();
  }, []);

  const handleSort = (event) => {
    const [key, direction] = event.target.value.split("_");
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    let sortedData = [];
    if (data.results !== undefined) {
      sortedData = [...data.results].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData;
  };

  const productsFiltered = getSortedData().filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ margin: "40px auto" }}>
        <ProductCarousel images={images} interval={10000} />
      </div>
      <Row>
        <Col md={9}>
          <Form.Group controlId="searchBar" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search by product's name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Select value={sortConfig} onChange={handleSort}>
            <option>Sort product</option>
            <option value={"name_asc"}>Name (A - Z)</option>
            <option value={"name_desc"}>Name (Z - A)</option>
            <option value={"price_asc"}>Price (Low - High)</option>
            <option value={"price_desc"}>Price (High - Low)</option>
          </Form.Select>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message message={error} variant="danger"></Message>
      ) : (
        <Row>
          {productsFiltered.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product}></Product>
            </Col>
          ))}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">Page {page}</div>
            <PaginationSimple
              totalCount={data.count}
              page={page}
              pageSize={PAGE_SIZE}
              onChange={setPage}
              disabled={loading}
            />
          </div>
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
