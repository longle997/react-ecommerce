import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import UserScreen from "./screens/UserScreen";
import LoginScreen from "./screens/LoginScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderListScreen from "./screens/OrderListScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import AdminScreen from "./screens/AdminScreen";
import AdminScreenUsers from "./screens/AdminScreenUsers";
import AdminScreenProducts from "./screens/AdminScreenProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div>
      {/* You need to wrap all the components inside the Router tag in order to make the link work */}
      <Router>
        <Header></Header>
        <Container>
          <Routes>
            <Route path="/" Component={HomeScreen} exact></Route>
            <Route path={"/products/:id"} Component={ProductScreen}></Route>
            <Route path={"/cart/:id?"} Component={CartScreen}></Route>
            <Route path={"/user"} Component={UserScreen}></Route>
            <Route path={"/login"} Component={LoginScreen}></Route>
            <Route path={"/shipping"} Component={ShippingScreen}></Route>
            <Route path={"/payment"} Component={PaymentScreen}></Route>
            <Route path={"/placeorder"} Component={PlaceOrderScreen}></Route>
            <Route path={"/orders"} Component={OrderListScreen}></Route>
            <Route path={"/orders/:id"} Component={OrderDetailsScreen}></Route>
            <Route path={"/admin/user"} Component={AdminScreenUsers}></Route>
            <Route
              path={"/admin/product"}
              Component={AdminScreenProducts}
            ></Route>
          </Routes>
        </Container>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
