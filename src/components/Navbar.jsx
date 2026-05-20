import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import {
    auth
} from "../firebase/firebase";

import iconstore from "../assets/iconstore.png";

function Navbar() {

    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(auth, (user) => {

                setCurrentUser(user);

            });

        return () => unsubscribe();

    }, []);

    const isAdmin =
        currentUser?.email === "thirtyone.zerozero@gmail.com";

    const logout = async () => {

        await signOut(auth);

        navigate("/");

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

                {/* TRACK ORDER */}
                <button
                    onClick={() =>
                        navigate("/track-order")
                    }
                >
                    Track Transaksi
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
                            👤 {currentUser.displayName || currentUser.email} ▼
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