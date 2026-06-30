import "./App.css";
import { useState, useEffect } from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import {
  auth,
  db,
  realtimeDb
} from "./firebase/firebase";

import {
  ref,
  set,
  onDisconnect,
  onValue
} from "firebase/database";

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
import GlobalTransactions from "./pages/GlobalTransactions";
import MyCoin from "./pages/MyCoin";
import ForgotPassword from "./pages/ForgotPassword";

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

          await setDoc(
            doc(db, "users", user.uid),
            {
              uid: user.uid,
              email: user.email,
              username: user.displayName || "",
              emailVerified: user.emailVerified
            },
            {
              merge: true
            }
          );

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

  // STATUS ADMIN REALTIME
  useEffect(() => {

    if (
      !currentUser ||
      userRole !== "admin"
    ) return;

    const adminStatusRef =
      ref(realtimeDb, "status/admin");

    const connectedRef =
      ref(realtimeDb, ".info/connected");

    const unsubscribe =
      onValue(connectedRef, async (snapshot) => {

        if (snapshot.val() === true) {

          await onDisconnect(adminStatusRef).set({
            online: false,
            lastSeen: Date.now(),
          });

          await set(adminStatusRef, {
            online: true,
            lastSeen: Date.now(),
          });

        }

      });

    return () => unsubscribe();

  }, [
    currentUser,
    userRole
  ]);

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

        <Route
          path="/global-transactions"
          element={<GlobalTransactions />}
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
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

        <Route
          path="/my-coin"
          element={<MyCoin />}
        />

      </Routes>

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>

  );

}

export default App;