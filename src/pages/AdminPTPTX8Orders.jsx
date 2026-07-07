import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    getDoc,
    addDoc,
    serverTimestamp,
    increment,
    arrayUnion
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import toast from "react-hot-toast";

import Swal from "sweetalert2";

import {
    FaCalendarAlt,
    FaGamepad,
    FaUser,
    FaEnvelope,
    FaMoneyBillWave,
    FaReceipt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
} from "react-icons/fa";

function AdminPTPTX8Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("Semua");

    const [selectedProof, setSelectedProof] = useState("");

    const [processingId, setProcessingId] = useState("");

    /* ===========================
            LOAD ORDERS
    =========================== */

    useEffect(() => {

        const q = query(

            collection(
                db,
                "ptptx8Orders"
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );

        const unsubscribe = onSnapshot(

            q,

            (snapshot) => {

                const data = snapshot.docs.map(

                    (doc) => ({

                        id: doc.id,

                        ...doc.data()

                    })

                );

                setOrders(data);

                setLoading(false);

            }

        );

        return () => unsubscribe();

    }, []);

    /* ===========================
            FILTER
    =========================== */

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const keyword = search.toLowerCase();

            const matchSearch =

                order.usernameRoblox?.toLowerCase().includes(keyword)

                ||

                order.email?.toLowerCase().includes(keyword)

                ||

                order.transactionId?.toLowerCase().includes(keyword);

            if (filter === "Semua") return matchSearch;

            return (

                matchSearch &&

                order.status === filter

            );

        });

    }, [

        orders,

        search,

        filter

    ]);

    const handleConfirm = async (order) => {

        const result = await Swal.fire({

            title: "Konfirmasi Pembayaran?",

            text: "Pembayaran ini akan dikonfirmasi.",

            icon: "question",

            background: "#111111",

            color: "#ffffff",

            showCancelButton: true,

            confirmButtonText: "Konfirmasi",

            cancelButtonText: "Batal",

            reverseButtons: true,

            confirmButtonColor: "#16a34a",

            cancelButtonColor: "#444",

            customClass: {

                popup: "premium-alert"

            }

        });

        if (!result.isConfirmed) return;

        await confirmPayment(order);

    };

    const confirmPayment = async (order) => {

        try {

            setProcessingId(order.id);

            if (
                order.participantAdded ||
                order.status === "Confirmed"
            ) {
                toast.error("Peserta sudah pernah dikonfirmasi.");
                return;
            }

            const eventRef = doc(
                db,
                "ptptx8Events",
                order.eventId
            );

            const eventSnap = await getDoc(eventRef);

            if (!eventSnap.exists()) {

                toast.error("Event tidak ditemukan.");

                return;

            }

            await updateDoc(eventRef, {

                participantCount: increment(1),

                participants: arrayUnion({

                    uid: order.buyerUid,

                    username: order.usernameRoblox,

                    email: order.email,

                    joinedAt: new Date().toISOString()

                })

            });

            await updateDoc(
                doc(db, "ptptx8Orders", order.id),
                {
                    status: "Confirmed",
                    paymentStatus: "Paid",
                    participantAdded: true
                }
            );

            await addDoc(
                collection(db, "ptptx8Participants"),
                {
                    eventId: order.eventId,
                    username: order.usernameRoblox,
                    buyerUsername: order.buyerUsername,
                    buyerUid: order.buyerUid,
                    email: order.email,
                    orderId: order.id,
                    createdAt: serverTimestamp()
                }
            );

            await updateDoc(
                doc(db, "globalTransactions", "stats"),
                {
                    totalTransactions: increment(1)
                }
            );

            /* ===========================
                     DISCORD WEBHOOK
               =========================== */

            try {

                console.log(
                    "PTPT WEBHOOK:",
                    import.meta.env.VITE_DISCORD_WEBHOOK_PTPTX8
                );

                await fetch("/api/discord", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        webhookUrl:
                            import.meta.env.VITE_DISCORD_WEBHOOK_PTPTX8,

                        embeds: [

                            {

                                color: 0xFACC15,

                                author: {
                                    name: "FS2B STORE • PT PT X8",
                                    icon_url: "https://res.cloudinary.com/mybhd82c/image/upload/v1783343642/1779368992008_olxbzv.png"
                                },

                                title: "✅ Pembayaran Berhasil Dikonfirmasi",

                                description:
                                    "Peserta berhasil masuk ke dalam **PT PT X8 Event**.",

                                thumbnail: {
                                    url: "https://res.cloudinary.com/mybhd82c/image/upload/v1783340984/ChatGPT_Image_6_Jul_2026_19.29.12_ejxa9b.png"
                                },

                                fields: [

                                    {
                                        name: "👤 Peserta",
                                        value: `**${order.buyerUsername}**`,
                                        inline: true
                                    },

                                    {
                                        name: "🎮 Roblox",
                                        value: `**${order.usernameRoblox}**`,
                                        inline: true
                                    },

                                    {
                                        name: "💰 Harga",
                                        value: `**Rp ${Number(order.totalPrice).toLocaleString("id-ID")}**`,
                                        inline: true
                                    },

                                    {
                                        name: "🎣 Event",
                                        value: order.eventTitle,
                                        inline: false
                                    },

                                    {
                                        name: "🆔 Transaction ID",
                                        value: `\`${order.transactionId}\``,
                                        inline: false
                                    }

                                ],

                                footer: {
                                    text: "FS2B STORE • Automatic Payment System"
                                },

                                timestamp: new Date().toISOString()

                            }

                        ]

                    })

                });

            } catch (err) {

                console.log("Discord Error:", err);

            }

            toast.success(
                "Pembayaran berhasil dikonfirmasi."
            );

        }

        catch (error) {

            console.error("Firestore Error:", error);
            console.error("Code:", error.code);
            console.error("Message:", error.message);

            toast.error(error.message);

        }

        finally {

            setProcessingId("");

        }

    };

    const handleReject = async (order) => {

        const result = await Swal.fire({

            title: "Tolak Pembayaran?",

            text: "Pembayaran ini akan ditolak.",

            icon: "warning",

            background: "#111111",

            color: "#ffffff",

            showCancelButton: true,

            confirmButtonText: "Tolak",

            cancelButtonText: "Batal",

            reverseButtons: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#444",

            customClass: {

                popup: "premium-alert"

            }

        });

        if (!result.isConfirmed) return;

        try {

            setProcessingId(order.id);

            await updateDoc(

                doc(
                    db,
                    "ptptx8Orders",
                    order.id
                ),

                {

                    status: "Rejected",

                    paymentStatus: "Rejected"

                }

            );

            toast.success(
                "Pembayaran berhasil ditolak."
            );

        }

        catch (error) {

            console.log(error);

            toast.error(
                "Terjadi kesalahan."
            );

        }

        finally {

            setProcessingId("");

        }

    };

    /* ===========================
            STATISTICS
    =========================== */

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(

        (x) => x.status === "Menunggu Verifikasi"

    ).length;

    const confirmedOrders = orders.filter(

        (x) => x.status === "Confirmed"

    ).length;

    const rejectedOrders = orders.filter(

        (x) => x.status === "Rejected"

    ).length;

    return (

        <div className="admin-page">

            <Navbar />

            <div className="admin-orders">

                {/* HEADER */}

                <div className="orders-header">

                    <div>

                        <h1>

                            🎣 PT PT X8 Orders

                        </h1>

                        <p>

                            Kelola seluruh pembayaran event PT PT X8.

                        </p>

                    </div>

                </div>

                {/* STATS */}

                <div className="orders-stats">

                    <div className="stat-card total">

                        <span>Total</span>

                        <strong>

                            {totalOrders}

                        </strong>

                    </div>

                    <div className="stat-card pending">

                        <span>Pending</span>

                        <strong>

                            {pendingOrders}

                        </strong>

                    </div>

                    <div className="stat-card success">

                        <span>Confirmed</span>

                        <strong>

                            {confirmedOrders}

                        </strong>

                    </div>

                    <div className="stat-card reject">

                        <span>Rejected</span>

                        <strong>

                            {rejectedOrders}

                        </strong>

                    </div>

                </div>

                {/* SEARCH */}

                <div className="orders-toolbar">

                    <input

                        type="text"

                        placeholder="Cari Username / Email / Transaction ID"

                        value={search}

                        onChange={(e) =>

                            setSearch(

                                e.target.value

                            )

                        }

                    />

                    <div className="orders-filter">

                        {

                            [

                                "Semua",

                                "Menunggu Verifikasi",

                                "Confirmed",

                                "Rejected"

                            ].map((item) => (

                                <button

                                    key={item}

                                    className={

                                        filter === item

                                            ? "active"

                                            : ""

                                    }

                                    onClick={() =>

                                        setFilter(item)

                                    }

                                >

                                    {item}

                                </button>

                            ))

                        }

                    </div>

                </div>

                {/* LIST */}

                {

                    loading ?

                        (

                            <div className="loading-orders">

                                Loading...

                            </div>

                        )

                        :

                        (

                            <div className="orders-list">

                                {

                                    filteredOrders.length === 0 ?

                                        (

                                            <div className="empty-orders">

                                                Tidak ada transaksi.

                                            </div>

                                        )

                                        :

                                        filteredOrders.map(

                                            (order) => (

                                                <div

                                                    key={order.id}

                                                    className="order-card"

                                                >

                                                    <div className="order-top">

                                                        <div className="order-header">

                                                            <div className="order-header-icon">

                                                                <FaReceipt />

                                                            </div>

                                                            <div>

                                                                <span className="order-label">

                                                                    ORDER ID

                                                                </span>

                                                                <h3>

                                                                    {order.transactionId}

                                                                </h3>

                                                            </div>

                                                        </div>

                                                        <span
                                                            className={`status-badge ${order.status === "Confirmed"
                                                                ? "confirmed"
                                                                : order.status === "Rejected"
                                                                    ? "rejected"
                                                                    : "pending"
                                                                }`}
                                                        >

                                                            {order.status === "Confirmed" && (
                                                                <FaCheckCircle className="status-icon" />
                                                            )}

                                                            {order.status === "Menunggu Verifikasi" && (
                                                                <FaClock className="status-icon" />
                                                            )}

                                                            {order.status === "Rejected" && (
                                                                <FaTimesCircle className="status-icon" />
                                                            )}

                                                            {order.status}

                                                        </span>

                                                    </div>

                                                    <div className="order-grid">

                                                        <div className="event-card">

                                                            <span>

                                                                <FaCalendarAlt className="info-icon" />

                                                                EVENT

                                                            </span>

                                                            <strong>

                                                                {order.eventTitle || "-"}

                                                            </strong>

                                                        </div>

                                                        <div className="roblox-card">

                                                            <span>

                                                                <FaGamepad className="info-icon" />

                                                                USERNAME ROBLOX

                                                            </span>

                                                            <strong>

                                                                {order.usernameRoblox}

                                                            </strong>

                                                        </div>

                                                        <div className="buyer-card">

                                                            <span>

                                                                <FaUser className="info-icon" />

                                                                NAMA PESERTA

                                                            </span>

                                                            <strong>

                                                                {order.buyerUsername}

                                                            </strong>

                                                        </div>

                                                        <div className="email-card">

                                                            <span>

                                                                <FaEnvelope className="info-icon" />

                                                                EMAIL

                                                            </span>

                                                            <strong>

                                                                {order.email}

                                                            </strong>

                                                        </div>

                                                        <div className="price-card">

                                                            <span>

                                                                <FaMoneyBillWave className="info-icon" />

                                                                HARGA

                                                            </span>

                                                            <strong>

                                                                Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}

                                                            </strong>

                                                        </div>

                                                    </div>

                                                    <div className="proof-section">

                                                        <h4>

                                                            Bukti Transfer

                                                        </h4>

                                                        <img

                                                            src={order.proof}

                                                            alt="Proof"

                                                            className="proof-image"

                                                            onClick={() =>

                                                                setSelectedProof(order.proof)

                                                            }

                                                        />

                                                    </div>

                                                    {order.status === "Menunggu Verifikasi" && (

                                                        <div className="order-actions">

                                                            <button

                                                                className="confirm-btn"

                                                                disabled={processingId === order.id}

                                                                onClick={() =>

                                                                    handleConfirm(order)

                                                                }

                                                            >

                                                                {

                                                                    processingId === order.id

                                                                        ?

                                                                        "Processing..."

                                                                        :

                                                                        "✔ Konfirmasi"

                                                                }

                                                            </button>

                                                            <button

                                                                className="reject-btn"

                                                                disabled={processingId === order.id}

                                                                onClick={() =>

                                                                    handleReject(order)

                                                                }

                                                            >

                                                                ✖ Reject

                                                            </button>

                                                        </div>

                                                    )}

                                                </div>

                                            )

                                        )

                                }

                            </div>

                        )

                }

                {

                    selectedProof && (

                        <div

                            className="proof-modal"

                            onClick={() =>

                                setSelectedProof("")

                            }

                        >

                            <div

                                className="proof-modal-content"

                                onClick={(e) =>

                                    e.stopPropagation()

                                }

                            >

                                <img

                                    src={selectedProof}

                                    alt="Proof"

                                />

                                <button

                                    onClick={() =>

                                        setSelectedProof("")

                                    }

                                >

                                    Tutup

                                </button>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default AdminPTPTX8Orders;