import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection
} from "firebase/firestore";

import {
  auth,
  db
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

        /* CHECK USERNAME */
        const usernameQuery = query(
          collection(db, "users"),
          where(
            "username",
            "==",
            username.toLowerCase()
          )
        );

        const usernameSnapshot =
          await getDocs(usernameQuery);

        if (!usernameSnapshot.empty) {

          alert("Username sudah digunakan");

          return;

        }

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user =
          userCredential.user;

        await updateProfile(user, {
          displayName: username
        });

        /* VERIFIKASI EMAIL */
        await sendEmailVerification(user);

        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            uid: user.uid,
            username:
              username.toLowerCase(),
            email
          }
        );

        alert(
          "Registrasi berhasil. Silakan cek email untuk verifikasi akun."
        );

        navigate("/login");

      } catch (error) {

        console.log("REGISTER ERROR:", error);

        alert(error.code);

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