import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

/* PAGES */
import Store from "./pages/Store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Rekber from "./pages/Rekber";
import RekberOrders from "./pages/RekberOrders";
import RekberOrderDetail from "./pages/RekberOrderDetail";
import RekberSaya from "./pages/RekberSaya";
import TentangKami from "./pages/TentangKami";

/* COMPONENTS */
import Footer from "./components/Footer";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* STORE */}
        <Route
          path="/"
          element={<Store />}
        />

        {/* TENTANG KAMI */}
        <Route
          path="/tentang-kami"
          element={<TentangKami />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* BUYER */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* REKBER */}
        <Route
          path="/rekber"
          element={<Rekber />}
        />

        <Route
          path="/rekber-orders"
          element={<RekberOrders />}
        />

        <Route
          path="/rekber/order/:id"
          element={<RekberOrderDetail />}
        />

        <Route
          path="/rekber-saya"
          element={<RekberSaya />}
        />

      </Routes>

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>

  );

}

export default App;