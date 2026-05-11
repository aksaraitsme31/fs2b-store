import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      alert("Login berhasil");
      navigate("/");
    } else {
      alert(
        "Username atau password salah"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login ke FS2B STORE
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