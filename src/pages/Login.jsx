import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
  signOut
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

          await sendEmailVerification(user);

          alert(
            "Email belum diverifikasi. Link verifikasi baru telah dikirim ke email Anda."
          );

          await signOut(auth);

          return;

        }

        alert(
          "Login berhasil"
        );

        navigate("/");

      } catch (error) {

        console.log(error);

        alert(error.message);

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