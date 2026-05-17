import { useNavigate } from "react-router-dom";
import { useState } from "react";
import iconstore from "../assets/iconstore.png";

function Navbar() {

    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    let currentUser = null;

    try {

        currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );

    } catch (error) {

        currentUser = null;

    }

    const isAdmin =
        currentUser?.email === "thirtyone.zerozero@gmail.com";

    const logout = () => {

        localStorage.removeItem("currentUser");

        navigate("/");

        window.location.reload();

    };

    return (

        <nav className="navbar">

            {/* LOGO */}
            <div
                className="logo"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
            >

                <img
                    src={iconstore}
                    alt="FS2B STORE"
                    className="logo-image"
                />

            </div>

            {/* MENU */}
            <div className="menu">

                {/* HOME */}
                <button onClick={() => navigate("/")}>
                    Home
                </button>

                {/* BUYER */}
                {currentUser && !isAdmin && (

                    <>

                        <button
                            onClick={() => navigate("/my-orders")}
                        >
                            Riwayat
                        </button>

                        <button
                            onClick={() => navigate("/rekber-saya")}
                        >
                            Rekber Saya
                        </button>

                    </>

                )}

                {/* ADMIN */}
                {isAdmin && (

                    <>

                        <button
                            onClick={() => navigate("/admin")}
                        >
                            Admin Panel
                        </button>

                        <button
                            onClick={() => navigate("/orders")}
                        >
                            Semua Orders
                        </button>

                        <button
                            onClick={() => navigate("/rekber-orders")}
                        >
                            Rekber Orders
                        </button>

                    </>

                )}

                {/* USER DROPDOWN */}
                {currentUser ? (

                    <div className="profile-dropdown">

                        <button
                            className="profile-btn"
                            onClick={() =>
                                setShowDropdown(!showDropdown)
                            }
                        >
                            👤 {currentUser.username} ▼
                        </button>

                        {showDropdown && (

                            <div className="dropdown-content">

                                <button
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >
                                    Profile
                                </button>

                                <button onClick={logout}>
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                ) : (

                    <>

                        <button
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>

                    </>

                )}

            </div>

        </nav>

    );

}

export default Navbar;