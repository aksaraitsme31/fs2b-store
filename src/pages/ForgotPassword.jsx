import { useState } from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    sendPasswordResetEmail
} from "firebase/auth";

import toast from "react-hot-toast";

import {
    auth
} from "../firebase/firebase";

import bgAuth from "../assets/backgroundreglog.png";

import "../styles/ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const navigate =
        useNavigate();

    const handleResetPassword = async () => {

        if (!email.trim()) {
            toast.error("Masukkan email terlebih dahulu.");
            return;
        }

        try {

            setLoading(true);

            await sendPasswordResetEmail(
                auth,
                email.trim(),
                {
                    url: window.location.origin + "/login"
                }
            );

            toast.success(
                "Link reset password berhasil dikirim ke email Anda."
            );

        } catch (error) {

            console.log("RESET PASSWORD ERROR CODE:", error.code);
            console.log("RESET PASSWORD ERROR MESSAGE:", error.message);
            console.log("RESET PASSWORD FULL ERROR:", error);

            switch (error.code) {

                case "auth/invalid-email":
                    toast.error("Format email tidak valid.");
                    break;

                case "auth/user-not-found":
                    toast.error("Email tidak terdaftar.");
                    break;

                case "auth/too-many-requests":
                    toast.error("Terlalu banyak percobaan. Coba lagi nanti.");
                    break;

                case "auth/unauthorized-continue-uri":
                    toast.error("Domain belum diizinkan di Firebase.");
                    break;

                case "auth/invalid-continue-uri":
                    toast.error("Redirect URL tidak valid.");
                    break;

                default:
                    toast.error("Gagal mengirim link reset password.");
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div
            className="forgot-password-page"
            style={{
                backgroundImage: `url(${bgAuth})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh"
            }}
        >

            <div className="forgot-password-box">

                <div className="forgot-password-icon">
                    🔐
                </div>

                <h1>
                    Reset Password
                </h1>

                <p className="forgot-password-subtitle">
                    Masukkan email yang terdaftar untuk menerima link reset password
                </p>

                <input
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    disabled={loading}
                />

                <button
                    onClick={handleResetPassword}
                    disabled={loading}
                >

                    {
                        loading
                            ? "Mengirim..."
                            : "Kirim Link Reset"
                    }

                </button>

                <p className="forgot-password-link">

                    Kembali ke{" "}

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

export default ForgotPassword;