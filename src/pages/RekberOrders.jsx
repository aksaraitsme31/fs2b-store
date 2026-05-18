import {
    useEffect,
    useState
} from "react";

import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    query,
    orderBy,
    where
} from "firebase/firestore";

import {
    db
} from "../firebase/firebase";

function RekberOrders() {

    const [
        rekberOrders,
        setRekberOrders
    ] = useState([]);

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    /* LOAD REKBER REALTIME */
    useEffect(() => {

        let q;

        if (
            currentUser.role === "admin"
        ) {

            q = query(
                collection(
                    db,
                    "rekberOrders"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );

        } else {

            q = query(
                collection(
                    db,
                    "rekberOrders"
                ),
                where(
                    "sellerId",
                    "==",
                    currentUser.uid
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );

        }

        const unsubscribe =
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

                    console.log(data);

                    setRekberOrders(data);

                }
            );

        return () => unsubscribe();

    }, []);

    /* VERIFIKASI PEMBAYARAN */
    const approveRekber =
        async (id) => {

            try {

                await updateDoc(
                    doc(
                        db,
                        "rekberOrders",
                        id
                    ),
                    {
                        status:
                            "Menunggu Seller Mengirim Barang",

                        paymentStatus:
                            "Sudah Diverifikasi"
                    }
                );

                alert(
                    "Pembayaran berhasil diverifikasi"
                );

            } catch (error) {

                console.log(error);

                alert(
                    "Gagal verifikasi pembayaran"
                );

            }

        };

    return (

        <div className="profile-page">

            <h1>
                Rekber Orders
            </h1>

            <div className="profile-section">

                {rekberOrders.length === 0 ? (

                    <div className="empty-products">
                        Belum ada rekber
                    </div>

                ) : (

                    rekberOrders.map(
                        (item) => (

                            <div
                                className="history-card"
                                key={item.id}
                            >

                                <div className="history-info">

                                    <h3>
                                        {item.itemName}
                                    </h3>

                                    <p>
                                        Buyer:
                                        {" "}
                                        {item.buyerUsername}
                                    </p>

                                    <p>
                                        Seller:
                                        {" "}
                                        {item.sellerUsername}
                                    </p>

                                    <p>
                                        Game:
                                        {" "}
                                        {item.game}
                                    </p>

                                    <p>
                                        Harga:
                                        {" "}
                                        Rp{" "}
                                        {Number(
                                            item.dealPrice
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>

                                    <p>
                                        Catatan:
                                        {" "}
                                        {item.notes}
                                    </p>

                                    {/* BUKTI TRANSFER */}
                                    {item.paymentProof && (

                                        <div
                                            style={{
                                                marginTop: "15px"
                                            }}
                                        >

                                            <p>
                                                Bukti Transfer:
                                            </p>

                                            <img
                                                src={item.paymentProof}
                                                alt="Bukti Transfer"
                                                style={{
                                                    width: "250px",
                                                    borderRadius: "10px",
                                                    marginTop: "10px"
                                                }}
                                            />

                                        </div>

                                    )}

                                    <p
                                        style={{
                                            marginTop: "15px"
                                        }}
                                    >
                                        Status:
                                        {" "}

                                        <span
                                            className={`status-text ${item.status ===
                                                "Barang Sudah Diterima Buyer" ||

                                                item.status ===
                                                "Done"
                                                ? "success"

                                                : item.status ===
                                                    "Menunggu Seller Mengirim Barang" ||

                                                    item.status ===
                                                    "Seller Sudah Mengirim Barang"
                                                    ? "process"

                                                    : "pending"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </p>

                                    {item.status ===
                                        "Menunggu Verifikasi Pembayaran" && (

                                            <button
                                                style={{
                                                    marginTop: "15px"
                                                }}
                                                onClick={() =>
                                                    approveRekber(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Verifikasi Pembayaran
                                            </button>

                                        )}

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );
}

export default RekberOrders;