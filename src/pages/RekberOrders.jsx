import Navbar from "../components/Navbar";

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
    where,
    getDoc
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

import {
    onAuthStateChanged
} from "firebase/auth";

function RekberOrders() {

    const [
        rekberOrders,
        setRekberOrders
    ] = useState([]);

    const [
        currentUser,
        setCurrentUser
    ] = useState(null);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(auth, (user) => {

                setCurrentUser(user);

            });

        return () => unsubscribe();

    }, []);

    console.log(currentUser);

    /* LOAD REKBER REALTIME */
    useEffect(() => {

        if (!currentUser?.uid) return;

        let unsubscribe;

        const loadRekber =
            async () => {

                try {

                    const userRef =
                        doc(
                            db,
                            "users",
                            currentUser.uid
                        );

                    const userSnap =
                        await getDoc(userRef);

                    const role =
                        userSnap.exists()
                            ? userSnap.data().role
                            : "";

                    let q;

                    /* ADMIN = LIHAT SEMUA */
                    if (role === "admin") {

                        q = query(
                            collection(
                                db,
                                "rekberOrders"
                            )
                        );

                    }

                    /* USER / SELLER */
                    else {

                        q = query(
                            collection(
                                db,
                                "rekberOrders"
                            ),
                            where(
                                "sellerId",
                                "==",
                                currentUser.uid
                            )
                        );

                    }

                    unsubscribe =
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
                                    (a, b) =>
                                        (
                                            b.createdAt?.seconds ||
                                            b.createdAt ||
                                            0
                                        ) -
                                        (
                                            a.createdAt?.seconds ||
                                            a.createdAt ||
                                            0
                                        )
                                );

                                setRekberOrders(data);

                            }
                        );

                } catch (error) {

                    console.log(error);

                }

            };

        loadRekber();

        return () => {

            if (unsubscribe) {

                unsubscribe();

            }

        };

    }, [currentUser]);

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

        <div className="store">

            <Navbar />

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

        </div>

    );

}

export default RekberOrders;