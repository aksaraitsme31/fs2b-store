import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

function Register() {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleRegister =
    async () => {

      if (
        !username ||
        !email ||
        !password
      ) {

        alert(
          "Isi semua data"
        );

        return;

      }

      try {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert(
          "Registrasi berhasil"
        );

        navigate("/login");

      } catch (error) {

        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          alert(
            "Email sudah digunakan"
          );

        } else {

          alert(
            "Registrasi gagal"
          );

        }

      }

    };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Daftar ke FS2B STORE
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

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
          onClick={
            handleRegister
          }
        >
          Register
        </button>

        <p className="auth-link">

          Sudah punya akun?

          <span
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
}

export default Register;