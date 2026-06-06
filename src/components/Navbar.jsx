import "./Navbar.css";

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
    set,
    onDisconnect,
    onValue,
} from "firebase/database";

import {
    auth,
    db,
    realtimeDb
} from "../firebase/firebase";

import iconicstore from "../assets/iconicstore.png";

import {
    FaHome,
    FaSearch,
    FaHistory,
    FaHandshake,
    FaGlobe,
    FaCrown,
    FaClipboardList,
    FaShieldAlt,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaCoins
} from "react-icons/fa";

function Navbar() {

    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const [menuOpen, setMenuOpen] =
        useState(false);

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

        if (userRole === "admin") {

            const adminStatusRef =
                ref(realtimeDb, "status/admin");

            await set(adminStatusRef, {
                online: false,
                lastSeen: Date.now(),
            });

        }

        await signOut(auth);

        navigate("/");

    };

    return (

        <>

            {
                menuOpen && (

                    <div
                        className="menu-overlay"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    />

                )
            }

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

                <button
                    className="hamburger"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* MENU */}
                <div
                    className={
                        menuOpen
                            ? "menu menu-open"
                            : "menu"
                    }
                >

                    {menuOpen && (

                        <div className="drawer-header">

                            <img
                                src={iconicstore}
                                alt="FS2B STORE"
                                className="drawer-logo"
                            />

                            <h3>FS2B STORE</h3>

                            <span>
                                Platform Digital Pilihanmu
                            </span>

                        </div>

                    )}

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
                    <button
                        onClick={() => {

                            navigate("/");

                            setMenuOpen(false);

                        }}
                    >
                        <FaHome />
                        <span>Home</span>
                    </button>

                    {/* TRACK ORDER */}
                    <button
                        onClick={() => {

                            navigate("/track-order");

                            setMenuOpen(false);

                        }}
                    >
                        <FaSearch />
                        <span>Pelacak Transaksi</span>
                    </button>

                    {/* BUYER */}
                    {currentUser && !isAdmin && (

                        <>

                            <button
                                onClick={() => {

                                    navigate("/my-orders");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaHistory />
                                <span>Riwayat Order</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/rekber-saya");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaHandshake />
                                <span>Rekber Saya</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/global-transactions");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaGlobe />
                                <span>Global Transactions</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/my-coin");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaCoins />
                                <span>My Coin</span>
                            </button>

                        </>

                    )}

                    {/* ADMIN */}
                    {isAdmin && (

                        <>

                            <button
                                onClick={() => {

                                    navigate("/admin");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaCrown />
                                <span>Admin Panel</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/orders");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaClipboardList />
                                <span>Semua Orders</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/rekber-orders");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaShieldAlt />
                                <span>Rekber Orders</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/global-transactions");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaGlobe />
                                <span>Global Transactions</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/my-coin");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaCoins />
                                <span>My Coin</span>
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
                                <FaUser />
                                <span>
                                    {currentUser.displayName || currentUser.email}
                                </span>
                            </button>

                            {showDropdown && (

                                <div className="dropdown-content">

                                    <button
                                        onClick={() => {

                                            navigate("/profile");

                                            setShowDropdown(false);

                                            setMenuOpen(false);

                                        }}
                                    >
                                        <FaUser />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        onClick={async () => {

                                            setShowDropdown(false);

                                            setMenuOpen(false);

                                            await logout();

                                        }}
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <>

                            <button
                                onClick={() => {

                                    navigate("/login");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaSignInAlt />
                                <span>Login</span>
                            </button>

                            <button
                                onClick={() => {

                                    navigate("/register");

                                    setMenuOpen(false);

                                }}
                            >
                                <FaUserPlus />
                                <span>Register</span>
                            </button>

                        </>

                    )}

                </div>

            </nav>

        </>

    );

}

export default Navbar;