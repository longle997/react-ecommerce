import React, { useState, useEffect, useMemo } from "react";
import AdminSteps from "../components/AdminSteps";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Table,
  Image,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  updateProduct,
  createProduct,
} from "../actions/ProductAction";
import Message from "../components/Message";
import axios from "axios";
import PaginationSimple from "../components/Pagination";

function EditProductModal({ show, onHide, product, onSave, user }) {
  // const [form, setForm] = useState({
  //     name: "",
  //     brand: "",
  //     price: "",
  //     countInStock: "",
  //     description: "",

  // })

  const [form, setForm] = useState({
    ...product,
  });

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
      });
    }
  }, [product]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function onSubmit(e) {
    onSave({ ...form });
    onHide();
  }

  // Add this in AdminScreenProducts (alongside saveProduct)
  const uploadProductImage = async (e) => {
    const fd = new FormData();
    const file = e.target.files?.[0];
    fd.append("image", file); // <-- DRF expects 'image' field (adjust if your serializer uses a different name)

    // Example endpoint 1 (nested route):
    // const url = `/api/products/${productId}/upload-image/`;

    // Example endpoint 2 (generic upload with product id param):
    const url = `/api/products/${product._id}/image/`;
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${user.access}`,
      },
    };

    const res = await axios.post(url, fd, config);
    // Expecting server to return { image: "https://..." } or similar
    return res.data;
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {product ? "Edit product" : "Create new product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter product Name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="price"
              type="float"
              value={form.price}
              onChange={onChange}
              placeholder="Enter product Price"
              min={0}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              name="brand"
              value={form.brand}
              onChange={onChange}
              placeholder="Enter product Brand"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Enter product Description"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={onChange}
              placeholder="Enter product Count In Stock"
              min={0}
            />
          </Form.Group>
          {product && (
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadProductImage}
                placeholder="Choose image"
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Save</Button>
          <Button onClick={onHide} variant="secondary">
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function ConfirmModal({
  show,
  title = "Confirm delete",
  body = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={isLoading ? undefined : onCancel} centered>
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <Spinner size="sm" animation="border" /> : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function AdminScreenProducts() {
  // const productsSelector = useSelector((state) => state.productList);
  // const { products } = productsSelector;
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editting, setEditting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletProductID, setDeletProductID] = useState(null);
  const userSelector = useSelector((state) => state.user);
  const { user } = userSelector;
  const dispatch = useDispatch();

  const [data, setData] = useState({
    count: 0,
    results: [],
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Set this to your DRF PAGE_SIZE for correct page count
  const PAGE_SIZE = 8; // ← change if your backend uses a different size

  const fetchPage = async (p) => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get("/api/products/", { params: { page: p } });
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

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.access}`,
    },
  };

  function openEdit(product) {
    setEditting(product);
    setShowModal(true);
  }

  function openDelete(productID) {
    setDeletProductID(productID);
    setShowDeleteModal(true);
  }

  function openCreate() {
    setShowModal(true);
  }

  function closeEdit() {
    setShowModal(false);
  }

  const saveProduct = async (updated) => {
    // await axios.put(`/api/products/${updated._id}/`, updated, config);
    if (updated._id) {
      dispatch(updateProduct(updated._id, updated, config));
    } else {
      dispatch(createProduct(updated, config));
    }
  };

  function closeDelete() {
    setShowDeleteModal(false);
  }

  const deleteProduct = async () => {
    await axios.delete(`/api/products/${deletProductID}/`, config);
    setShowDeleteModal(false);
    dispatch(listProducts());
  };

  function cmp(a, b) {
    const A = a ?? null;
    const B = b ?? null;
    if (A === B) return 0;
    if (A === null) return 1; // push null/undefined to the bottom
    if (B === null) return -1;

    // Numbers
    const aNum = typeof A === "number" || (!isNaN(A) && A !== "");
    const bNum = typeof B === "number" || (!isNaN(B) && B !== "");
    if (aNum && bNum) return Number(A) - Number(B);

    // Fallback: case-insensitive string compare
    return String(A).toLowerCase().localeCompare(String(B).toLowerCase());
  }

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();

    const filtered = q
      ? data.results.filter((product) => {
          const hay = `${product.name || ""} ${product.price || ""} ${
            product.countInStock || ""
          }`.toLocaleLowerCase();
          return hay.includes(q);
        })
      : data.results.slice();
    const dir = sortDirection === "desc" ? -1 : 1;

    return filtered.sort((a, b) => {
      const A = a?.[sortField];
      const B = b?.[sortField];
      return dir * cmp(A, B);
    });
  }, [data.results, sortField, sortDirection, query]);

  if (user.isAdmin === false) {
    return <Message variant="danger">You are not admin</Message>;
  }

  return (
    <Container className="py-3">
      <AdminSteps
        step1
        step2
        paths={{ step1: "/admin/user", step2: "/admin/product" }}
      ></AdminSteps>
      <h3 className="text-center">ADMIN PRODUCT PAGE</h3>
      <Row>
        <Col md={6}>
          <Form.Label>Search</Form.Label>
          <InputGroup>
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control
              placeholder="Search by product's name, price, count in stock"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label>Sort by</Form.Label>
          <Form.Select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="countInStock">Count In Stock</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Sort direction</Form.Label>
          <Form.Select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="py-3">
        <Col>
          <Button onClick={() => openCreate()}>Add new product</Button>
        </Col>
      </Row>

      <Table striped hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Count In Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredSorted.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>
                <Image width={100} src={product.image}></Image>
              </td>
              <td>{product.brand}</td>
              <td>{product.price}</td>
              <td>{product.countInStock}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" onClick={() => openEdit(product)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => openDelete(product._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <EditProductModal
        show={showModal}
        onHide={closeEdit}
        product={editting}
        onSave={saveProduct}
        user={user}
      />
      <ConfirmModal
        show={showDeleteModal}
        title="Confirm delete"
        body="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteProduct}
        onCancel={closeDelete}
      />
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
    </Container>
  );
}

export default AdminScreenProducts;
