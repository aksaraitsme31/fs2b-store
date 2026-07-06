import Navbar from "../components/Navbar";

import toast from "react-hot-toast";

import {
    useEffect,
    useState
} from "react";

import {
    FaCalendarAlt,
    FaGamepad,
    FaUser,
    FaEnvelope,
    FaMoneyBillWave,
    FaReceipt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaCopy,
    FaRegCalendarCheck
} from "react-icons/fa";

import {
    collection,
    query,
    where,
    onSnapshot
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

import {
    onAuthStateChanged
} from "firebase/auth";

function RiwayatPtptku() {

    const [orders, setOrders] =
        useState([]);

    const [
        selectedOrder,
        setSelectedOrder
    ] = useState(null);

    useEffect(() => {

        const unsubscribeAuth =
            onAuthStateChanged(
                auth,
                (currentUser) => {

                    if (!currentUser) {

                        setOrders([]);

                        return;

                    }

                    const q = query(

                        collection(
                            db,
                            "ptptx8Orders"
                        ),

                        where(
                            "buyerUid",
                            "==",
                            currentUser.uid
                        )

                    );

                    const unsubscribeOrders =
                        onSnapshot(

                            q,

                            (snapshot) => {

                                const data =
                                    snapshot.docs.map(
                                        (doc) => ({

                                            id: doc.id,

                                            ...doc.data()

                                        })
                                    );

                                data.sort(
                                    (a, b) => {

                                        const timeA =
                                            a.createdAt?.seconds || 0;

                                        const timeB =
                                            b.createdAt?.seconds || 0;

                                        return timeB - timeA;

                                    }
                                );

                                setOrders(data);

                            },

                            (error) => {

                                console.log(error);

                                toast.error(
                                    "Gagal mengambil data"
                                );

                            }

                        );

                    return () =>
                        unsubscribeOrders();

                }

            );

        return () =>
            unsubscribeAuth();

    }, []);

    return (

        <div className="store">

            <Navbar />

            <section className="ptptku-section">

                <h2 className="ptptku-title">
                    Riwayat PT PT X8 Saya
                </h2>

                <div className="ptptku-grid-wrapper">

                    {

                        orders.length === 0 ?

                            (

                                <div className="ptptku-empty">

                                    Belum ada riwayat PT PT X8

                                </div>

                            )

                            :

                            orders.map((order) => (

                                <div
                                    className="card-ptptku"
                                    key={order.id}
                                >

                                    <div className="ptptku-top">

                                        <div className="ptptku-header">

                                            <div className="ptptku-header-icon">

                                                <FaReceipt />

                                            </div>

                                            <div>

                                                <span className="ptptku-label">

                                                    ORDER ID

                                                </span>

                                                <h3>

                                                    {order.transactionId}

                                                </h3>

                                            </div>

                                        </div>

                                        <span
                                            className={`ptptku-status ${order.status === "Confirmed"
                                                ? "confirmed"
                                                : order.status === "Rejected"
                                                    ? "rejected"
                                                    : "pending"
                                                }`}
                                        >

                                            {order.status === "Confirmed" && <FaCheckCircle />}

                                            {order.status === "Menunggu Verifikasi" && (
                                                <FaClock className="status-icon" />
                                            )}

                                            {order.status === "Rejected" && <FaTimesCircle />}

                                            {order.status}

                                        </span>

                                    </div>

                                    <div className="ptptku-grid">

                                        <div className="ptptku-event">

                                            <span>

                                                <FaCalendarAlt />

                                                EVENT

                                            </span>

                                            <strong>

                                                {order.eventTitle}

                                            </strong>

                                        </div>

                                        <div className="ptptku-roblox">

                                            <span>

                                                <FaGamepad />

                                                USERNAME ROBLOX

                                            </span>

                                            <strong>

                                                {order.usernameRoblox}

                                            </strong>

                                        </div>

                                        <div className="ptptku-buyer">

                                            <span>

                                                <FaUser />

                                                NAMA PESERTA

                                            </span>

                                            <strong>

                                                {order.buyerUsername}

                                            </strong>

                                        </div>

                                        <div className="ptptku-email">

                                            <span>

                                                <FaEnvelope />

                                                EMAIL

                                            </span>

                                            <strong>

                                                {order.email}

                                            </strong>

                                        </div>

                                        <div className="ptptku-date">

                                            <span>

                                                <FaRegCalendarCheck />

                                                TANGGAL ORDER

                                            </span>

                                            <strong>

                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt.seconds * 1000
                                                    ).toLocaleString("id-ID", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "-"}

                                            </strong>

                                        </div>

                                        <div className="ptptku-price">

                                            <span>

                                                <FaMoneyBillWave />

                                                HARGA

                                            </span>

                                            <strong>

                                                Rp{" "}

                                                {Number(
                                                    order.totalPrice || 0
                                                ).toLocaleString("id-ID")}

                                            </strong>

                                        </div>

                                    </div>

                                    <div className="ptptku-buttons">

                                        <button

                                            className="ptptku-copy-btn"

                                            onClick={async () => {

                                                await navigator.clipboard.writeText(
                                                    order.transactionId
                                                );

                                                toast.success(
                                                    "ID berhasil disalin"
                                                );

                                            }}

                                        >

                                            <FaCopy />

                                            Copy ID

                                        </button>



                                    </div>

                                </div>

                            ))

                    }

                </div>

            </section>

        </div>

    );

}

export default RiwayatPtptku;