import Navbar from "../components/Navbar";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useState,
    useEffect
} from "react";

import toast from "react-hot-toast";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    increment
} from "firebase/firestore";

import {
    ref,
    onValue
} from "firebase/database";

import {
    db,
    auth,
    realtimeDb
} from "../firebase/firebase";

import qrisImage from "../assets/qris.jpeg";

function PaymentPTPTX8() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const event = state?.event;

    const username = state?.username || "";

    const currentUser = auth.currentUser;

    const [proof, setProof] = useState("");

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);

    const [adminOnline, setAdminOnline] = useState(false);

    /* ===============================
            ADMIN ONLINE STATUS
    =============================== */

    useEffect(() => {

        const statusRef = ref(
            realtimeDb,
            "status/admin"
        );

        const unsubscribe = onValue(
            statusRef,
            (snapshot) => {

                const data = snapshot.val();

                setAdminOnline(
                    data?.online || false
                );

            }
        );

        return () => unsubscribe();

    }, []);

    /* ===============================
            EVENT NOT FOUND
    =============================== */

    if (!event) {

        return (

            <div className="store">

                <Navbar />

                <div className="payment-wrapper">

                    <div className="payment-card">

                        <h2>

                            ⚠ Event Tidak Ditemukan

                        </h2>

                        <p>

                            Event yang kamu pilih
                            sudah tidak tersedia
                            atau halaman telah kedaluwarsa.

                        </p>

                        <button
                            className="payment-btn"
                            onClick={() => navigate("/")}
                        >

                            Kembali ke Store

                        </button>

                    </div>

                </div>

            </div>

        );

    }

    /* ===============================
            UPLOAD BUKTI
    =============================== */

    const handleProofUpload = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (
            !file.type.startsWith("image/")
        ) {

            toast.error(
                "File harus berupa gambar."
            );

            return;

        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            toast.error(
                "Ukuran gambar maksimal 5MB."
            );

            return;

        }

        const reader =
            new FileReader();

        reader.onloadend = () => {

            setProof(reader.result);

            setPreview(reader.result);

        };

        reader.readAsDataURL(file);

    };

    /* ===============================
        VALIDASI SEBELUM BAYAR
    =============================== */

    const validatePayment = () => {

        if (!currentUser) {

            toast.error(
                "Silakan login terlebih dahulu 😀"
            );

            navigate("/login");

            return false;

        }

        if (!currentUser.emailVerified) {

            toast.error(
                "Verifikasi email terlebih dahulu 😉"
            );

            return false;

        }

        if (!username.trim()) {

            toast.error(
                "Username Roblox tidak ditemukan."
            );

            navigate(-1);

            return false;

        }

        if (!proof) {

            toast.error(
                "Upload bukti transfer terlebih dahulu."
            );

            return false;

        }

        if (!adminOnline) {

            toast.error(
                "Admin sedang offline."
            );

            return false;

        }

        return true;

    };

    return (

        <div className="store">

            <Navbar />

            <div className="payment-wrapper">

                <div className="payment-card">

                    <div className="payment-header">

                        <h1>

                            🎣 PAYMENT PT PT X8

                        </h1>

                        <p>

                            Selesaikan pembayaran
                            untuk mengamankan slot
                            event kamu.

                        </p>

                    </div>

                    {/* EVENT */}

                    <div className="payment-section">

                        <h3>

                            Detail Event

                        </h3>

                        <div className="payment-grid">

                            <div>

                                <span>Nama Event</span>

                                <strong>

                                    {event.title}

                                </strong>

                            </div>

                            <div>

                                <span>Host</span>

                                <strong>

                                    {event.host}

                                </strong>

                            </div>

                            <div>

                                <span>Tanggal</span>

                                <strong>

                                    {event.eventDate}

                                </strong>

                            </div>

                            <div>

                                <span>Jam</span>

                                <strong>

                                    {event.startTime}

                                </strong>

                            </div>

                            <div>

                                <span>Username Roblox</span>

                                <strong>

                                    {username}

                                </strong>

                            </div>

                            <div>

                                <span>Total Pembayaran</span>

                                <strong className="payment-price">

                                    Rp{" "}

                                    {Number(
                                        event.price || 0
                                    ).toLocaleString("id-ID")}

                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* QRIS */}

                    <div className="payment-section">

                        <h3>

                            Pembayaran QRIS

                        </h3>

                        <div className="qris-box">

                            <img
                                src={qrisImage}
                                alt="QRIS"
                                className="qris-image"
                            />

                            <h2>

                                Rp{" "}

                                {Number(
                                    event.price || 0
                                ).toLocaleString("id-ID")}

                            </h2>

                            <p>

                                Scan QRIS di atas
                                kemudian upload bukti
                                pembayaran.

                            </p>

                        </div>

                    </div>

                    {/* Upload */}

                    <div className="payment-section">

                        <h3>

                            Upload Bukti Transfer

                        </h3>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={
                                handleProofUpload
                            }
                        />

                        {preview && (

                            <div className="proof-preview">

                                <img
                                    src={preview}
                                    alt="Preview"
                                />

                            </div>

                        )}

                    </div>

                    {/* STATUS ADMIN */}

                    <div
                        className={`admin-status ${adminOnline
                            ? "online"
                            : "offline"
                            }`}
                    >

                        <span className="status-dot"></span>

                        <div>

                            <strong>

                                {
                                    adminOnline
                                        ? "Admin Online"
                                        : "Admin Offline"
                                }

                            </strong>

                            <p>

                                {
                                    adminOnline
                                        ? "Pembayaran dapat diverifikasi sekarang."
                                        : "Transaksi sementara ditutup."
                                }

                            </p>

                        </div>

                    </div>

                    {/* BUTTON */}

                    <button

                        className="payment-btn"

                        disabled={
                            !adminOnline ||
                            loading
                        }

                        onClick={
                            handlePayment
                        }

                    >

                        {
                            loading
                                ? "Mengirim..."
                                : "💳 Kirim Bukti Pembayaran"
                        }

                    </button>

                    <button

                        className="payment-back-btn"

                        onClick={() => navigate(-1)}

                    >

                        ← Kembali

                    </button>

                </div>

            </div>

        </div>

    );

    /* ===============================
            HANDLE PAYMENT
    =============================== */

    async function handlePayment() {

        if (!validatePayment()) return;

        try {

            setLoading(true);

            const transactionId =
                `FS2B-PTPTX8-${Date.now()}`;

            await addDoc(

                collection(
                    db,
                    "ptptx8Orders"
                ),

                {

                    transactionId,

                    transactionType: "PT PT X8",

                    eventId:
                        event.id,

                    eventTitle:
                        event.title,

                    eventStatus:
                        event.status,

                    registrationOpen:
                        event.registrationOpen,

                    host:
                        event.host,

                    eventDate:
                        event.eventDate,

                    startTime:
                        event.startTime,

                    maxParticipants:
                        event.maxParticipants,

                    usernameRoblox:
                        username,

                    buyerUid:
                        currentUser.uid,

                    buyerUsername:
                        currentUser.displayName ||
                        "Anonymous",

                    email:
                        currentUser.email,

                    rewardCoin:
                        0,

                    coinRewarded:
                        false,

                    price:
                        event.price,

                    totalPrice:
                        event.price,

                    proof,

                    status:
                        "Menunggu Verifikasi",

                    paymentStatus:
                        "Pending",

                    participantAdded:
                        false,

                    createdAt:
                        serverTimestamp(),

                    date:
                        new Date().toLocaleDateString(
                            "id-ID"
                        ),

                    time:
                        new Date().toLocaleTimeString(
                            "id-ID",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )

                }

            );

            await updateDoc(
                doc(
                    db,
                    "globalNotifications",
                    "admin"
                ),
                {
                    unreadPTPTX8Orders: increment(1)
                }
            );

            toast.success(
                "Pembayaran berhasil dikirim 🚀"
            );

            setTimeout(() => {

                navigate(
                    "/riwayat-ptptku"
                );

            }, 800);

        }

        catch (error) {

            console.log(error);

            toast.error(
                "Terjadi kesalahan saat mengirim pembayaran."
            );

        }

        finally {

            setLoading(false);

        }

    }

}

export default PaymentPTPTX8;