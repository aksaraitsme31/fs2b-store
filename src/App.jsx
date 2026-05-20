import "./App.css";
import { useState, useEffect } from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  auth
} from "./firebase/firebase";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
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
import TrackOrder from "./pages/TrackOrder";

/* COMPONENTS */
import Footer from "./components/Footer";

function App() {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, (user) => {

        setCurrentUser(user);

      });

    return () => unsubscribe();

  }, []);

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

        <Route
          path="/track-order"
          element={<TrackOrder />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            currentUser?.email === "thirtyone.zerozero@gmail.com"
              ? <Admin />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/orders"
          element={
            currentUser?.email === "thirtyone.zerozero@gmail.com"
              ? <Orders />
              : <Navigate to="/" />
          }
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