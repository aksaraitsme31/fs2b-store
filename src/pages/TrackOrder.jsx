import Navbar from "../components/Navbar";

import {
    useState
} from "react";

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
                        Track Transaksi
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

                            <p>
                                🆔 ID:
                                {" "}
                                {order.transactionId}
                            </p>

                            <p>
                                📦 Produk:
                                {" "}
                                {order.product}
                            </p>

                            <p>
                                💰 Total:
                                {" "}
                                Rp{" "}
                                {Number(
                                    order.totalPrice
                                ).toLocaleString(
                                    "id-ID"
                                )}
                            </p>

                            <p>
                                📅 Tanggal:
                                {" "}
                                {order.date}
                            </p>

                            <div
                                style={{
                                    marginTop: "20px"
                                }}
                            >

                                <h3
                                    style={{
                                        marginBottom: "15px"
                                    }}
                                >
                                    Progress Transaksi
                                </h3>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "10px"
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
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                margin: "0 auto",
                                                background:
                                                    order.status === "Menunggu Verifikasi" ||
                                                        order.status === "Diproses" ||
                                                        order.status === "Selesai"
                                                        ? "#facc15"
                                                        : "#444",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            1
                                        </div>

                                        <p
                                            style={{
                                                marginTop: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Verifikasi
                                        </p>

                                    </div>

                                    {/* LINE */}
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "4px",
                                            background:
                                                order.status === "Diproses" ||
                                                    order.status === "Selesai"
                                                    ? "#3b82f6"
                                                    : "#444",
                                            borderRadius: "10px"
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
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                margin: "0 auto",
                                                background:
                                                    order.status === "Diproses" ||
                                                        order.status === "Selesai"
                                                        ? "#3b82f6"
                                                        : "#444",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            2
                                        </div>

                                        <p
                                            style={{
                                                marginTop: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Diproses
                                        </p>

                                    </div>

                                    {/* LINE */}
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "4px",
                                            background:
                                                order.status === "Selesai"
                                                    ? "#22c55e"
                                                    : "#444",
                                            borderRadius: "10px"
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
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                margin: "0 auto",
                                                background:
                                                    order.status === "Selesai"
                                                        ? "#22c55e"
                                                        : "#444",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            3
                                        </div>

                                        <p
                                            style={{
                                                marginTop: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Selesai
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default TrackOrder;