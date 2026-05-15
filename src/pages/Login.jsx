import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

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

        alert(
          "Isi semua data"
        );

        return;

      }

      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        /* CEK ADMIN */
        const isAdmin =
          email ===
          "thirtyone.zerozero@gmail.com";

        /* SIMPAN USER */
        const userData = {

          email,

          username:
            email.split("@")[0],

          role: isAdmin
            ? "admin"
            : "buyer"

        };

        localStorage.setItem(
          "currentUser",
          JSON.stringify(
            userData
          )
        );

        alert(
          "Login berhasil"
        );

        navigate("/");

      } catch (error) {

        if (
          error.code ===
          "auth/invalid-credential"
        ) {

          alert(
            "Email atau password salah"
          );

        } else {

          alert(
            "Login gagal"
          );

        }

      }

    };

  return (
    <div className="auth-page">

      <div className="auth-box">

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