import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import toast from "react-hot-toast";

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

        toast.error(
          "Isi semua data terlebih dahulu 😤"
        );

        return;

      }

      const cleanUsername =
        username
          .trim()
          .toLowerCase();

      const allowedAdminEmails = [
        "thirtyone.zerozero@gmail.com",
        "aufahisyam79@gmail.com"
      ];

      if (
        (
          cleanUsername.includes("admin") ||
          cleanUsername.includes("fs2b")
        ) &&
        !allowedAdminEmails.includes(
          email.trim().toLowerCase()
        )
      ) {

        toast.error(
          "Username tersebut tidak diperbolehkan 😤"
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
            cleanUsername
          )
        );

        const usernameSnapshot =
          await getDocs(usernameQuery);

        if (!usernameSnapshot.empty) {

          toast.error(
            "Username sudah digunakan 😒"
          );

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

        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            uid: user.uid,
            username: cleanUsername,
            email
          }
        );

        toast.success(
          "Registrasi berhasil 🎉"
        );

        navigate("/login");

      } catch (error) {

        console.log("REGISTER ERROR:", error);

        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          toast.error(
            "Email sudah digunakan 😒"
          );

        } else if (
          error.code ===
          "auth/weak-password"
        ) {

          toast.error(
            "Password minimal 6 karakter 😤"
          );

        } else {

          toast.error(
            "Registrasi gagal 😔"
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