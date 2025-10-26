// Import React and needed hooks
import React, { useMemo, useState, useEffect } from "react";
// Import UI components from react-bootstrap
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";
import AdminSteps from "../components/AdminSteps";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../actions/UserAction";

// ---- helpers ----

// Helper function: get user ID safely (backend may use either `_id` or `id`)
const getId = (u) => u && (u._id ?? u.id);

// Object containing multiple sort functions for different criteria
const sorters = {
  // Sort alphabetically by name (A → Z)
  name_asc: (a, b) => (a.name || "").localeCompare(b.name || ""),
  // Sort alphabetically by name (Z → A)
  name_desc: (a, b) => (b.name || "").localeCompare(a.name || ""),
  // Sort alphabetically by email (A → Z)
  email_asc: (a, b) => (a.email || "").localeCompare(b.email || ""),
  // Sort alphabetically by email (Z → A)
  email_desc: (a, b) => (b.email || "").localeCompare(a.email || ""),
  // Sort by admin first, then by name
  admin_first: (a, b) =>
    Number(b.isAdmin) - Number(a.isAdmin) ||
    (a.name || "").localeCompare(b.name || ""),
};

// ------------------ Edit Modal Component ------------------
function EditUserModal({ show, onHide, user, onSave }) {
  // Local form state (used to store editable user fields)
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    isAdmin: false,
    password: "",
  });

  // Whenever `user` changes, populate the form with that user’s info
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        name: user.name || "",
        isAdmin: Boolean(user.isAdmin),
      });
    }
  }, [user]);

  // Handle field changes — updates local form state
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    // if the field is a checkbox → use checked (boolean)
    // else → use value (string, number, etc.)
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  // Handle submit (Save button)
  const onSubmit = (e) => {
    if (!form.email.trim()) return alert("Email is required");
    if (!form.username.trim()) return alert("Username is required");
    if (user !== null) {
      delete form.password;
    }
    // This creates a new object that includes all properties of user, then overwrites any keys that also exist in form.
    onSave({ ...user, ...form }); // send updated user data to parent component
  };

  // Render the Bootstrap Modal with form inputs
  return (
    <Modal show={show} onHide={onHide} centered>
      {/* Wrap everything in a form for easy submission */}
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{user ? "Edit User" : "Create new user"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Username input */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Enter username"
            />
          </Form.Group>

          {/* Email input */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="name@example.com"
            />
          </Form.Group>

          {/* Name input */}
          {!user && (
            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Full name"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
            />
          </Form.Group>

          {/* Checkbox for admin role */}
          <Form.Check
            id="isAdmin"
            name="isAdmin"
            type="checkbox"
            label="Administrator"
            checked={form.isAdmin}
            onChange={onChange}
          />
        </Modal.Body>

        <Modal.Footer>
          {/* Buttons to cancel or save */}
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
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

// ------------------ Main Component: AdminScreenUsers ------------------
export default function AdminScreenUsers() {
  // Store all users in state (fetched or passed from parent)
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search query and sort selection
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletUserID, setDeletUserID] = useState(null);
  const [toast, setToast] = useState({
    isShow: false,
    message: "",
    variant: "info",
  });

  // Modal state (whether it’s open, and which user is being edited)
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const userSelector = useSelector((state) => state.user);
  const { user } = userSelector;
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.access}`,
    },
  };

  const fetchUsers = async () => {
    try {
      const userResponse = await axios.get(
        "https://vercel-django-eosin.vercel.app/api/users",
        config
      );
      setUsers(userResponse.data);
    } catch (error) {
      if (error.status === 401) {
        dispatch(userLogout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Compute filtered + sorted user list based on search + sort
  // Now Sorting... logs only when items actually changes, not every render.
  const filteredSorted = useMemo(() => {
    // Normalize query to lowercase
    const q = query.trim().toLowerCase();

    // Filter users if query exists (match username/email/name)
    const filtered = q
      ? users.filter((u) => {
          const hay = `${u.username || ""} ${u.email || ""} ${
            u.name || ""
          }`.toLowerCase();
          return hay.includes(q);
        })
      : users.slice(); // no query → use full list

    // Apply selected sort method
    const cmp = sorters[sort] || sorters.name_asc;
    return filtered.sort(cmp);
  }, [users, query, sort]); // recompute whenever dependencies change

  // Open edit modal and set selected user
  const openEdit = (user) => {
    setEditing(user);
    setShowModal(true);
  };

  // Close edit modal
  const closeEdit = () => setShowModal(false);

  // Save user after editing
  const saveUser = async (updated) => {
    // ⚠️ In a real app, you would call your backend API here (PUT /users/:id)
    // Example: await fetch(`https://vercel-django-eosin.vercel.app/api/users/${getId(updated)}`, { method: "PUT", body: JSON.stringify(updated) })
    try {
      if (updated.id !== null && updated.id !== undefined) {
        await axios.put(
          `https://vercel-django-eosin.vercel.app/api/users/update/${updated.id}`,
          updated,
          config
        );
        setUsers((prev) =>
          prev.map((u) =>
            getId(u) === getId(updated) ? { ...u, ...updated } : u
          )
        );
      } else {
        await axios.post(
          "https://vercel-django-eosin.vercel.app/api/users/register/",
          updated,
          config
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      setShowModal(false); // close modal after saving
      setToast({
        isShow: true,
        message: "Successfully updated user info",
        variant: "info",
      });
    } catch (error) {
      setToast({
        isShow: true,
        message:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        variant: "danger",
      });
    }
  };

  if (user.isAdmin === false) {
    return <Message variant="danger">You are not admin</Message>;
  }

  function addNewUser() {
    setEditing(null);
    setShowModal(true);
  }

  function openDelete(deleteUserID) {
    setDeletUserID(deleteUserID);
    setShowDeleteModal(true);
  }

  function closeDelete() {
    setShowDeleteModal(false);
  }

  const deleteUser = async () => {
    const { data } = await axios.delete(
      `https://vercel-django-eosin.vercel.app/api/users/delete/${deletUserID}/`,
      config
    );
    setShowDeleteModal(false);
    fetchUsers();
  };

  // -------- JSX UI --------
  return (
    <Container className="py-3">
      <ToastContainer position="top-end">
        <Toast
          bg={toast.variant}
          show={toast.isShow}
          onClose={() => setToast({ ...toast, isShow: false })}
          delay={3000}
          autohide
        >
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Top row: Search input + Sort select */}
      <AdminSteps
        step1
        step2
        paths={{ step1: "/admin/user", step2: "/admin/product" }}
      ></AdminSteps>
      <h3 className="text-center">ADMIN USER PAGE</h3>
      <Row className="align-items-end g-2">
        <Col xs={12} md={6}>
          <Form.Label htmlFor="userSearch">Search</Form.Label>
          <InputGroup>
            <InputGroup.Text id="search-icon" aria-hidden>
              🔎
            </InputGroup.Text>
            <Form.Control
              id="userSearch"
              placeholder="Search by username, email, name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-describedby="search-icon"
            />
          </InputGroup>
        </Col>

        <Col xs={12} md="auto">
          <Form.Label htmlFor="userSort">Sort by</Form.Label>
          <Form.Select
            id="userSort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name_asc">Name (A → Z)</option>
            <option value="name_desc">Name (Z → A)</option>
            <option value="email_asc">Email (A → Z)</option>
            <option value="email_desc">Email (Z → A)</option>
            <option value="admin_first">Admin first</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="py-3">
        <Col>
          <Button onClick={addNewUser}>Add new user</Button>
        </Col>
      </Row>

      {/* Table showing all users */}
      <Table striped hover responsive className="mt-3">
        <thead>
          <tr>
            <th style={{ minWidth: 80 }}>ID</th>
            <th style={{ minWidth: 160 }}>Username</th>
            <th style={{ minWidth: 220 }}>Email</th>
            <th style={{ minWidth: 180 }}>Name</th>
            <th style={{ minWidth: 120 }}>Role</th>
            <th style={{ minWidth: 100 }} />
          </tr>
        </thead>

        <tbody>
          {/* Loop through users */}
          {filteredSorted.map((u) => (
            <tr key={getId(u)}>
              <td>{getId(u)}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>
                {/* Show “Admin” or “User” badge */}
                {u.isAdmin ? (
                  <Badge bg="success">Admin</Badge>
                ) : (
                  <Badge bg="secondary">User</Badge>
                )}
              </td>
              <td className="text-end">
                {/* Edit button triggers modal */}
                <Button size="sm" onClick={() => openEdit(u)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDelete(u.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {/* Message if no users found */}
          {filteredSorted.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Include modal component */}
      <EditUserModal
        show={showModal}
        onHide={closeEdit}
        user={editing}
        onSave={saveUser}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="Confirm delete"
        body="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteUser}
        onCancel={closeDelete}
      />
    </Container>
  );
}
