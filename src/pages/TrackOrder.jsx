import Navbar from "../components/Navbar";

import {
    useState
} from "react";

import {
    CheckCircle,
    Clock3,
    PackageCheck
} from "lucide-react";

import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot
} from "firebase/firestore";

import {
    db
} from "../firebase/firebase";

function TrackOrder() {

    const [transactionId, setTransactionId] =
        useState("");

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [unsubscribeListener, setUnsubscribeListener] =
        useState(null);

    /* CEK TRANSAKSI */
    const checkTransaction =
        async () => {

            if (!transactionId) {

                alert(
                    "Masukkan ID transaksi"
                );

                return;

            }

            try {

                setLoading(true);

                /* =========================
                   CEK APAKAH REKBER
                ========================= */

                if (
                    transactionId.startsWith(
                        "FS2B-RKB-"
                    )
                ) {

                    const rekberQuery =
                        query(
                            collection(
                                db,
                                "rekberOrders"
                            ),

                            where(
                                "transactionId",
                                "==",
                                transactionId
                            )
                        );

                    const unsubscribeRekber =
                        onSnapshot(
                            rekberQuery,
                            (snapshot) => {

                                if (snapshot.empty) {

                                    alert(
                                        "Transaksi rekber tidak ditemukan"
                                    );

                                    setOrder(null);

                                    setLoading(false);

                                    return;

                                }

                                const data =
                                    snapshot.docs[0].data();

                                setOrder({
                                    type: "rekber",
                                    ...data
                                });

                                setLoading(false);

                            }
                        );

                    if (unsubscribeListener) {

                        unsubscribeListener();

                    }

                    setUnsubscribeListener(
                        () => unsubscribeRekber
                    );

                    return;

                }

                /* =========================
                   ORDER BIASA
                ========================= */

                const q =
                    query(
                        collection(
                            db,
                            "orders"
                        ),

                        where(
                            "transactionId",
                            "==",
                            transactionId
                        )
                    );

                const unsubscribe =
                    onSnapshot(q, (snapshot) => {

                        if (snapshot.empty) {

                            alert(
                                "Transaksi tidak ditemukan"
                            );

                            setOrder(null);

                            setLoading(false);

                            return;

                        }

                        const data =
                            snapshot.docs[0].data();

                        setOrder(data);

                        setLoading(false);

                    });

                if (unsubscribeListener) {

                    unsubscribeListener();

                }

                setUnsubscribeListener(
                    () => unsubscribe
                );

            } catch (error) {

                console.log(error);

                alert(
                    "Gagal cek transaksi"
                );

                setLoading(false);

            }

        };

    return (

        <div className="store">

            <Navbar />

            <div className="auth-page">

                <div className="auth-box">

                    <h1>
                        Lacak Transaksi
                    </h1>

                    <input
                        type="text"
                        placeholder="Masukkan ID Transaksi"
                        value={transactionId}
                        onChange={(e) =>
                            setTransactionId(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                checkTransaction();

                            }

                        }}
                    />

                    <button
                        onClick={
                            checkTransaction
                        }
                    >

                        {loading
                            ? "Mengecek..."
                            : "Cek Status"}

                    </button>

                    {/* HASIL */}
                    {order && (

                        <div
                            style={{
                                marginTop: "25px",
                                textAlign: "left",
                                background:
                                    "rgba(255,255,255,0.05)",
                                padding: "20px",
                                borderRadius: "18px",
                                border:
                                    "1px solid rgba(255,255,255,0.1)"
                            }}
                        >

                            <h2
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >
                                Status Transaksi
                            </h2>

                            {/* =========================
            TAMPILAN REKBER
        ========================= */}
                            {order.type === "rekber" ? (

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px"
                                    }}
                                >

                                    <div
                                        style={{
                                            padding: "14px",
                                            borderRadius: "14px",
                                            background:
                                                "rgba(59,130,246,0.12)",
                                            border:
                                                "1px solid rgba(59,130,246,0.3)"
                                        }}
                                    >

                                        <p>
                                            🆔 ID Rekber
                                        </p>

                                        <h3
                                            style={{
                                                marginTop: "6px",
                                                color: "#60a5fa"
                                            }}
                                        >
                                            {order.transactionId}
                                        </h3>

                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gap: "12px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(255,255,255,0.04)"
                                            }}
                                        >
                                            👤 Buyer:
                                            {" "}
                                            <b>
                                                {order.buyerUsername}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(255,255,255,0.04)"
                                            }}
                                        >
                                            🗣️ Seller:
                                            {" "}
                                            <b>
                                                {order.sellerUsername}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(255,255,255,0.04)"
                                            }}
                                        >
                                            🎮 Game:
                                            {" "}
                                            <b>
                                                {order.game}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(255,255,255,0.04)"
                                            }}
                                        >
                                            📦 Item:
                                            {" "}
                                            <b>
                                                {order.itemName}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(34,197,94,0.12)",
                                                border:
                                                    "1px solid rgba(34,197,94,0.25)"
                                            }}
                                        >
                                            💰 Harga Deal:
                                            {" "}
                                            <b
                                                style={{
                                                    color: "#4ade80"
                                                }}
                                            >
                                                Rp{" "}
                                                {Number(
                                                    order.dealPrice
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    "rgba(255,255,255,0.04)"
                                            }}
                                        >
                                            📅 Tanggal:
                                            {" "}
                                            <b>
                                                {order.date || "-"}
                                            </b>

                                            <br />

                                            ⏰ Waktu:
                                            {" "}
                                            <b>
                                                {order.time || "-"}
                                            </b>
                                        </div>

                                        <div
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background:
                                                    order.status === "Selesai"
                                                        ? "rgba(34,197,94,0.12)"
                                                        : "rgba(250,204,21,0.12)",

                                                border:
                                                    order.status === "Selesai"
                                                        ? "1px solid rgba(34,197,94,0.25)"
                                                        : "1px solid rgba(250,204,21,0.25)"
                                            }}
                                        >
                                            📌 Status:
                                            {" "}

                                            <b
                                                style={{
                                                    color:
                                                        order.status === "Selesai"
                                                            ? "#4ade80"
                                                            : "#facc15"
                                                }}
                                            >
                                                {order.status}
                                            </b>

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                /* =========================
                                    TAMPILAN ORDER ITEM
                                ========================= */

                                <>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "16px"
                                        }}
                                    >

                                        {/* HEADER STATUS */}
                                        <div
                                            style={{
                                                padding: "20px",
                                                borderRadius: "22px",

                                                background:
                                                    "linear-gradient(145deg, rgba(25,25,25,0.95), rgba(40,40,40,0.9))",

                                                border:
                                                    "1px solid rgba(255,215,0,0.12)",

                                                boxShadow:
                                                    "0 0 30px rgba(255,215,0,0.06)"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "18px"
                                                }}
                                            >

                                                <h2
                                                    style={{
                                                        fontSize: "28px",
                                                        fontWeight: "800"
                                                    }}
                                                >
                                                    Status Transaksi
                                                </h2>

                                                <div
                                                    style={{
                                                        padding: "10px 18px",
                                                        borderRadius: "999px",

                                                        background:
                                                            order.status === "Selesai"
                                                                ? "linear-gradient(90deg,#22c55e,#16a34a)"
                                                                : order.status === "Diproses"
                                                                    ? "linear-gradient(90deg,#3b82f6,#2563eb)"
                                                                    : "linear-gradient(90deg,#facc15,#eab308)",

                                                        color: "#fff",
                                                        fontWeight: "700",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    {order.status}
                                                </div>

                                            </div>

                                            {/* ID */}
                                            <div
                                                style={{
                                                    padding: "16px",
                                                    borderRadius: "18px",

                                                    background:
                                                        "rgba(59,130,246,0.10)",

                                                    border:
                                                        "1px solid rgba(59,130,246,0.22)"
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        color: "#9ca3af",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Transaction ID
                                                </p>

                                                <h3
                                                    style={{
                                                        marginTop: "8px",
                                                        color: "#60a5fa",
                                                        fontSize: "22px",
                                                        wordBreak: "break-all"
                                                    }}
                                                >
                                                    {order.transactionId}
                                                </h3>

                                            </div>

                                        </div>

                                        {/* GRID INFO */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap: "14px"
                                            }}
                                        >

                                            {/* PRODUK */}
                                            <div
                                                style={{
                                                    padding: "18px",
                                                    borderRadius: "18px",

                                                    background:
                                                        "rgba(255,255,255,0.04)",

                                                    border:
                                                        "1px solid rgba(255,255,255,0.05)"
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        color: "#9ca3af",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Produk
                                                </p>

                                                <h3
                                                    style={{
                                                        marginTop: "8px",
                                                        fontSize: "20px"
                                                    }}
                                                >
                                                    {order.product}
                                                </h3>

                                            </div>

                                            {/* TOTAL */}
                                            <div
                                                style={{
                                                    padding: "18px",
                                                    borderRadius: "18px",

                                                    background:
                                                        "rgba(34,197,94,0.08)",

                                                    border:
                                                        "1px solid rgba(34,197,94,0.15)"
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        color: "#9ca3af",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Total Pembayaran
                                                </p>

                                                <h3
                                                    style={{
                                                        marginTop: "8px",
                                                        color: "#4ade80",
                                                        fontSize: "22px"
                                                    }}
                                                >
                                                    Rp{" "}
                                                    {Number(
                                                        order.totalPrice
                                                    ).toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </h3>

                                            </div>

                                        </div>

                                        {/* DATE */}
                                        <div
                                            style={{
                                                padding: "18px",
                                                borderRadius: "18px",

                                                background:
                                                    "rgba(255,255,255,0.04)",

                                                border:
                                                    "1px solid rgba(255,255,255,0.05)"
                                            }}
                                        >

                                            <p
                                                style={{
                                                    color: "#9ca3af",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                Waktu Transaksi
                                            </p>

                                            <h3
                                                style={{
                                                    marginTop: "10px",
                                                    fontSize: "18px"
                                                }}
                                            >
                                                📅 {order.date}
                                            </h3>

                                            <h3
                                                style={{
                                                    marginTop: "10px",
                                                    fontSize: "18px"
                                                }}
                                            >
                                                ⏰ {order.time}
                                            </h3>

                                        </div>

                                        {/* PROGRESS */}
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                padding: "24px",
                                                borderRadius: "22px",

                                                background:
                                                    "linear-gradient(145deg, rgba(18,18,18,0.95), rgba(30,30,30,0.9))",

                                                border:
                                                    "1px solid rgba(255,255,255,0.05)"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    marginBottom: "24px",
                                                    fontSize: "24px",
                                                    fontWeight: "800"
                                                }}
                                            >
                                                Progress Transaksi
                                            </h3>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "12px"
                                                }}
                                            >

                                                {/* STEP 1 */}
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width: "62px",
                                                            height: "62px",

                                                            borderRadius: "50%",

                                                            margin: "0 auto",

                                                            background:
                                                                order.status === "Menunggu Verifikasi" ||
                                                                    order.status === "Diproses" ||
                                                                    order.status === "Selesai"
                                                                    ? "linear-gradient(145deg,#facc15,#eab308)"
                                                                    : "#333",

                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",

                                                            fontWeight: "800",
                                                            fontSize: "22px",

                                                            boxShadow:
                                                                "0 0 20px rgba(250,204,21,0.35)"
                                                        }}
                                                    >
                                                        <Clock3 size={28} />
                                                    </div>

                                                    <p
                                                        style={{
                                                            marginTop: "12px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        Verifikasi
                                                    </p>

                                                </div>

                                                {/* LINE */}
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        height: "5px",
                                                        borderRadius: "999px",

                                                        background:
                                                            order.status === "Diproses" ||
                                                                order.status === "Selesai"
                                                                ? "linear-gradient(90deg,#3b82f6,#2563eb)"
                                                                : "#333"
                                                    }}
                                                />

                                                {/* STEP 2 */}
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width: "62px",
                                                            height: "62px",

                                                            borderRadius: "50%",

                                                            margin: "0 auto",

                                                            background:
                                                                order.status === "Diproses" ||
                                                                    order.status === "Selesai"
                                                                    ? "linear-gradient(145deg,#3b82f6,#2563eb)"
                                                                    : "#333",

                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",

                                                            fontWeight: "800",
                                                            fontSize: "22px",

                                                            boxShadow:
                                                                "0 0 20px rgba(59,130,246,0.35)"
                                                        }}
                                                    >
                                                        <PackageCheck size={28} />
                                                    </div>

                                                    <p
                                                        style={{
                                                            marginTop: "12px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        Diproses
                                                    </p>

                                                </div>

                                                {/* LINE */}
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        height: "5px",
                                                        borderRadius: "999px",

                                                        background:
                                                            order.status === "Selesai"
                                                                ? "linear-gradient(90deg,#22c55e,#16a34a)"
                                                                : "#333"
                                                    }}
                                                />

                                                {/* STEP 3 */}
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width: "62px",
                                                            height: "62px",

                                                            borderRadius: "50%",

                                                            margin: "0 auto",

                                                            background:
                                                                order.status === "Selesai"
                                                                    ? "linear-gradient(145deg,#22c55e,#16a34a)"
                                                                    : "#333",

                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",

                                                            fontWeight: "800",
                                                            fontSize: "22px",

                                                            boxShadow:
                                                                "0 0 20px rgba(34,197,94,0.35)"
                                                        }}
                                                    >
                                                        <CheckCircle size={28} />
                                                    </div>

                                                    <p
                                                        style={{
                                                            marginTop: "12px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        Selesai
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default TrackOrder;