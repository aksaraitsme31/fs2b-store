import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    ref,
    onValue,
} from "firebase/database";

import {
    auth,
    db,
    realtimeDb
} from "../firebase/firebase";

import iconicstore from "../assets/iconicstore.png";

function Navbar() {

    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const [userRole, setUserRole] = useState("");

    const [adminOnline, setAdminOnline] =
        useState(false);

    // AUTH USER

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(auth, async (user) => {

                setCurrentUser(user);

                if (user) {

                    const userRef =
                        doc(db, "users", user.uid);

                    const userSnap =
                        await getDoc(userRef);

                    if (userSnap.exists()) {

                        setUserRole(
                            userSnap.data().role || ""
                        );

                    }

                }

            });

        return () => unsubscribe();

    }, []);

    // ADMIN STATUS REALTIME

    useEffect(() => {

        const statusRef =
            ref(realtimeDb, "status/admin");

        const unsubscribe =
            onValue(statusRef, (snapshot) => {

                const data =
                    snapshot.val();

                setAdminOnline(
                    data?.online || false
                );

            });

        return () => unsubscribe();

    }, []);

    const isAdmin =
        userRole === "admin";

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
                    src={iconicstore}
                    alt="FS2B STORE"
                    className="logo-image"
                />

            </div>

            {/* MENU */}
            <div className="menu">

                {/* ADMIN STATUS */}
                <div className="premium-status">

                    <div
                        className={
                            adminOnline
                                ? "premium-dot online"
                                : "premium-dot offline"
                        }
                    ></div>

                    <div className="premium-text">

                        <span className="premium-title">

                            {adminOnline
                                ? "ADMIN ONLINE"
                                : "ADMIN OFFLINE"}

                        </span>

                        <span className="premium-subtitle">

                            {adminOnline
                                ? "Admin siap untuk merespon"
                                : "Mohon tunggu sampai Admin online kembali"}

                        </span>

                    </div>

                </div>

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
                    Pelacak Transaksi
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