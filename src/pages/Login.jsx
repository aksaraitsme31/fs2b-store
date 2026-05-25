import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  signInWithEmailAndPassword,
  reload
} from "firebase/auth";

import toast from "react-hot-toast";

import {
  auth
} from "../firebase/firebase";

import bgAuth from "../assets/backgroundreglog.png";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin =
    async () => {

      if (
        !email ||
        !password
      ) {

        toast.error(
          "Isi semua data terlebih dahulu."
        );

        return;

      }

      try {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user =
          userCredential.user;

        /* REFRESH STATUS EMAIL */
        await reload(user);

        /* CEK VERIFIKASI EMAIL */
        if (!user.emailVerified) {

          toast(
            "Email belum di verifikasi! Segera verifikasi untuk menikmati layanan FS2B Store 😉",
            {
              icon: "⚠️"
            }
          );

        } else {

          toast.success(
            "Login berhasil 😉"
          );

        }

        /* DELAY AGAR TOAST MUNCUL DULU */
        setTimeout(() => {

          navigate("/");

        }, 1800);

      } catch (error) {

        console.log(error);

        toast.error(
          "Email atau password salah."
        );

      }

    };

  return (

    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${bgAuth})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}
    >

      <div className="auth-box premium-auth-box flip-login">

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login ke FS2B STORE
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="auth-link">

          Belum punya akun?

          <span
            onClick={() =>
              navigate(
                "/register"
              )
            }
          >
            Register
          </span>

        </p>

      </div>

    </div>

  );

}

export default Login;