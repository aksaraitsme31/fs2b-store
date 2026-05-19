import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import {
    doc,
    updateDoc,
    onSnapshot
} from "firebase/firestore";

import {
    db
} from "../firebase/firebase";

function RekberOrderDetail() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [
        order,
        setOrder
    ] = useState(null);

    const [
        paymentProof,
        setPaymentProof
    ] = useState(null);

    /* LOAD ORDER REALTIME */
    useEffect(() => {

        const docRef =
            doc(
                db,
                "rekberOrders",
                id
            );

        const unsubscribe =
            onSnapshot(
                docRef,
                (snapshot) => {

                    if (
                        snapshot.exists()
                    ) {

                        setOrder({
                            id: snapshot.id,
                            ...snapshot.data()
                        });

                    }

                }
            );

        return () => unsubscribe();

    }, [id]);

    /* UPLOAD PAYMENT */
    const uploadPaymentProof =
        async () => {

            if (!paymentProof) {

                alert(
                    "Upload bukti transfer terlebih dahulu"
                );

                return;

            }

            try {

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    paymentProof
                );

                formData.append(
                    "upload_preset",
                    "fs2b_rekber"
                );

                const response =
                    await fetch(
                        "https://api.cloudinary.com/v1_1/dubdwcahm/image/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                console.log(data.secure_url);

                await updateDoc(
                    doc(
                        db,
                        "rekberOrders",
                        order.id
                    ),
                    {
                        paymentProof:
                            data.secure_url,

                        paymentStatus:
                            "Menunggu Verifikasi",

                        status:
                            "Menunggu Verifikasi Pembayaran"
                    }
                );

                alert(
                    "Bukti pembayaran berhasil diupload"
                );

                navigate("/rekber-saya");

            } catch (error) {

                console.log(error);

                alert(
                    "Gagal upload bukti transfer"
                );

            }

        };

    if (!order) {

        return (

            <div className="profile-page">

                <h1>
                    Loading...
                </h1>

            </div>

        );

    }

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    return (

        <div className="profile-page">

            <h1>
                Detail Rekber
            </h1>

            <div className="profile-section">

                {/* TOP GRID */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "30px",
                        marginBottom: "30px"
                    }}
                >

                    {/* DETAIL */}
                    <div
                        style={{
                            padding: "30px",
                            borderRadius: "24px",
                            border:
                                "1px solid rgba(255,200,0,0.12)",
                            background:
                                "rgba(255,255,255,0.02)"
                        }}
                    >

                        <h2
                            style={{
                                color: "#f5c542",
                                marginBottom: "30px"
                            }}
                        >
                            📋 DETAIL TRANSAKSI
                        </h2>

                        {[
                            ["Buyer", order.buyerUsername],
                            ["Seller", order.sellerUsername],
                            ["Game", order.game],
                            ["Item", order.itemName]
                        ].map((item, index) => (

                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    padding: "18px 0",
                                    borderBottom:
                                        "1px solid rgba(255,255,255,0.06)"
                                }}
                            >

                                <span
                                    style={{
                                        color: "#aaa",
                                        fontSize: "18px"
                                    }}
                                >
                                    {item[0]}
                                </span>

                                <strong
                                    style={{
                                        fontSize: "18px"
                                    }}
                                >
                                    {item[1]}
                                </strong>

                            </div>

                        ))}

                    </div>

                    {/* PAYMENT SUMMARY */}
                    <div
                        style={{
                            padding: "30px",
                            borderRadius: "24px",
                            border:
                                "1px solid rgba(255,200,0,0.12)",
                            background:
                                "rgba(255,255,255,0.02)"
                        }}
                    >

                        <h2
                            style={{
                                color: "#f5c542",
                                marginBottom: "30px"
                            }}
                        >
                            💳 RINGKASAN PEMBAYARAN
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gap: "20px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >
                                <span>Harga Deal</span>

                                <strong>
                                    Rp {Number(order.dealPrice)
                                        .toLocaleString("id-ID")}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >
                                <span>Fee Type</span>

                                <span
                                    style={{
                                        background: "#f5c542",
                                        color: "#000",
                                        padding:
                                            "6px 16px",
                                        borderRadius:
                                            "999px",
                                        fontWeight:
                                            "bold"
                                    }}
                                >
                                    {order.feeType}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >
                                <span>Fee Rekber</span>

                                <strong
                                    style={{
                                        color: "#65ff9a"
                                    }}
                                >
                                    Rp {Number(order.fee || 0)
                                        .toLocaleString("id-ID")}
                                </strong>
                            </div>

                            <div
                                style={{
                                    marginTop: "20px",
                                    paddingTop: "25px",
                                    borderTop:
                                        "1px solid rgba(255,255,255,0.08)"
                                }}
                            >

                                <p
                                    style={{
                                        color: "#f5c542",
                                        fontWeight:
                                            "bold",
                                        marginBottom:
                                            "10px"
                                    }}
                                >
                                    TOTAL PEMBAYARAN
                                </p>

                                <h1
                                    style={{
                                        fontSize: "48px",
                                        color: "#fff"
                                    }}
                                >
                                    Rp {Number(order.totalPayment || order.dealPrice)
                                        .toLocaleString("id-ID")}
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>

                {/* STATUS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "25px",
                        marginBottom: "30px"
                    }}
                >

                    <div
                        style={{
                            padding: "25px",
                            borderRadius: "22px",
                            background:
                                "rgba(255,255,255,0.02)",
                            border:
                                "1px solid rgba(255,200,0,0.1)"
                        }}
                    >

                        <p
                            style={{
                                color: "#aaa",
                                marginBottom: "10px"
                            }}
                        >
                            STATUS TRANSAKSI
                        </p>

                        <div
                            style={{
                                display: "inline-block",
                                padding:
                                    "10px 20px",
                                borderRadius:
                                    "999px",
                                background:
                                    "#184ea6",
                                color: "#fff",
                                fontWeight:
                                    "bold"
                            }}
                        >
                            {order.status}
                        </div>

                    </div>

                    <div
                        style={{
                            padding: "25px",
                            borderRadius: "22px",
                            background:
                                "rgba(255,255,255,0.02)",
                            border:
                                "1px solid rgba(255,200,0,0.1)"
                        }}
                    >

                        <p
                            style={{
                                color: "#aaa",
                                marginBottom: "10px"
                            }}
                        >
                            STATUS PEMBAYARAN
                        </p>

                        <div
                            style={{
                                display: "inline-block",
                                padding: "10px 20px",
                                borderRadius: "999px",

                                background:
                                    order.paymentStatus === "Sudah Diverifikasi"
                                        ? "rgba(0,255,100,0.18)"
                                        : "rgba(255,0,0,0.18)",

                                color:
                                    order.paymentStatus === "Sudah Diverifikasi"
                                        ? "#65ff9a"
                                        : "#ff4d4f",

                                border:
                                    order.paymentStatus === "Sudah Diverifikasi"
                                        ? "1px solid rgba(0,255,100,0.4)"
                                        : "1px solid rgba(255,0,0,0.4)",

                                fontWeight: "bold"
                            }}
                        >
                            {order.paymentStatus}
                        </div>

                    </div>

                </div>

                {/* QRIS */}
                {order.paymentStatus ===
                    "Belum Dibayar" && (

                        <div
                            style={{
                                marginTop: "25px"
                            }}
                        >

                            <p>
                                Scan QRIS Pembayaran:
                            </p>

                            <img
                                src={order.qrisImage}
                                alt="QRIS"
                                style={{
                                    width: "100%",
                                    maxWidth: "320px",
                                    borderRadius: "16px",
                                    marginTop: "10px"
                                }}
                            />

                        </div>

                    )}

                {/* PAYMENT PROOF */}
                {order.paymentProof && (

                    <div
                        style={{
                            marginTop: "25px"
                        }}
                    >

                        <p>
                            Bukti Transfer:
                        </p>

                        <img
                            src={
                                order.paymentProof
                            }
                            alt="Bukti Transfer"
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                borderRadius: "16px",
                                marginTop: "10px"
                            }}
                        />

                    </div>

                )}

                {/* UPLOAD PAYMENT */}
                <div
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setPaymentProof(
                                e.target.files[0]
                            )
                        }
                    />

                    <button
                        style={{
                            marginTop: "15px"
                        }}
                        onClick={
                            uploadPaymentProof
                        }
                    >
                        Upload Bukti Transfer
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RekberOrderDetail;