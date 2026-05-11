import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password) {
      alert("Isi semua data");
      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    users.push({
      username,
      password,
      role: "buyer",
      createdAt:
        new Date().toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        )
    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert(
      "Registrasi berhasil"
    );

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Daftar ke FS2B STORE
        </p>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
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