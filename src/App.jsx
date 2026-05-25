import "./App.css";
import { useState, useEffect } from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "./firebase/firebase";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";

/* COMPONENTS */
import Footer from "./components/Footer";

function App() {

  const [currentUser, setCurrentUser] = useState(null);

  const [userRole, setUserRole] = useState("");

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, async (user) => {

        setCurrentUser(user);

        if (user) {

          const userRef =
            doc(db, "users", user.uid);

          const userSnap =
            await getDoc(userRef);

          if (userSnap.exists()) {

            setUserRole(
              userSnap.data().role || ""
            );

          }

        } else {

          setUserRole("");

        }

      });

    return () => unsubscribe();

  }, []);

  return (

    <BrowserRouter>

      {/* PREMIUM TOASTER */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0f0f0f",
            color: "#ffffff",
            border:
              "1px solid rgba(255,215,0,0.18)",
            borderRadius: "18px",
            padding: "16px 18px",
            fontWeight: "600",
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.45)"
          },

          success: {
            style: {
              background: "#111111",
              color: "#ffffff",
              border:
                "1px solid rgba(0,255,170,0.22)"
            }
          },

          error: {
            style: {
              background: "#111111",
              color: "#ffffff",
              border:
                "1px solid rgba(255,80,80,0.25)"
            }
          }

        }}
      />

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

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            userRole === "admin"
              ? <Admin />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/orders"
          element={
            userRole === "admin"
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