import Navbar from "../components/Navbar";

import qrisImage from "../assets/qris.jpeg";

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

function Rekber() {

    const navigate =
        useNavigate();

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    const [
        buyerUsername
    ] = useState(
        currentUser?.username || ""
    );

    const [
        sellerUsername,
        setSellerUsername
    ] = useState("");

    const [
        game,
        setGame
    ] = useState("");

    const [
        itemName,
        setItemName
    ] = useState("");

    const [
        dealPrice,
        setDealPrice
    ] = useState("");

    const [
        notes,
        setNotes
    ] = useState("");

    const [
        feeType,
        setFeeType
    ] = useState("EX");

    /* HITUNG FEE */
    const calculateFee = (price) => {

        const num = Number(price);

        if (!num || num <= 0) return 0;

        return (Math.floor(num / 50000) + 1) * 1000;

    };

    const price =
        Number(dealPrice || 0);

    const fee =
        calculateFee(price);

    const totalPayment =
        feeType === "EX"
            ? price + fee
            : price;

    const sellerReceive =
        feeType === "INC"
            ? price - fee
            : price;

    /* CREATE REKBER */
    const createRekber =
        async () => {

            const firebaseUser =
                auth.currentUser;

            if (
                !buyerUsername ||
                !sellerUsername ||
                !game ||
                !itemName ||
                !dealPrice
            ) {

                alert(
                    "Lengkapi data terlebih dahulu"
                );

                return;

            }

            try {

                const userQuery = query(
                    collection(db, "users"),
                    where(
                        "username",
                        "==",
                        sellerUsername
                    )
                );

                const userSnapshot =
                    await getDocs(userQuery);

                if (userSnapshot.empty) {

                    alert("Seller tidak ditemukan");

                    return;

                }

                const sellerData =
                    userSnapshot.docs[0].data();

                const sellerId =
                    sellerData.uid;

                const newRekber = {

                    buyerId:
                        firebaseUser.uid,

                    buyerUsername,

                    sellerId,

                    sellerUsername,

                    game,

                    itemName,

                    dealPrice,

                    feeType,
                    fee,

                    totalPayment,
                    sellerReceive,

                    notes,

                    qrisImage,

                    paymentStatus:
                        "Belum Dibayar",

                    status:
                        "Menunggu Pembayaran",

                    chatLocked: false,

                    createdAt:
                        Date.now()

                };

                const docRef =
                    await addDoc(
                        collection(
                            db,
                            "rekberOrders"
                        ),
                        newRekber
                    );

                navigate(
                    `/rekber/order/${docRef.id}`
                );

            } catch (error) {

                console.log(error);

                alert(
                    "Gagal membuat rekber"
                );

            }

        };

    return (

        <div className="store">

            <Navbar />

            <div className="profile-page">

                <div className="profile-section">

                    <input
                        placeholder="Username Buyer"
                        value={buyerUsername}
                        readOnly
                    />

                    <input
                        placeholder="Username Seller"
                        value={sellerUsername}
                        onChange={(e) =>
                            setSellerUsername(
                                e.target.value
                            )
                        }
                    />

                    <input
                        placeholder="Game"
                        value={game}
                        onChange={(e) =>
                            setGame(
                                e.target.value
                            )
                        }
                    />

                    <input
                        placeholder="Nama Item"
                        value={itemName}
                        onChange={(e) =>
                            setItemName(
                                e.target.value
                            )
                        }
                    />

                    <input
                        placeholder="Harga Deal"
                        value={dealPrice}
                        onChange={(e) =>
                            setDealPrice(
                                e.target.value
                            )
                        }
                    />

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <p
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            Fee Rekber
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setFeeType("EX")
                                }
                                style={{
                                    background:
                                        feeType === "EX"
                                            ? "#f5c542"
                                            : "#222",
                                    color:
                                        feeType === "EX"
                                            ? "#000"
                                            : "#fff"
                                }}
                            >
                                Fee EX
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFeeType("INC")
                                }
                                style={{
                                    background:
                                        feeType === "INC"
                                            ? "#f5c542"
                                            : "#222",
                                    color:
                                        feeType === "INC"
                                            ? "#000"
                                            : "#fff"
                                }}
                            >
                                Fee INC
                            </button>

                        </div>

                    </div>

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <p>
                            Fee Rekber:
                            Rp {fee.toLocaleString("id-ID")}
                        </p>

                        <p>

                            Total Bayar:

                            Rp {totalPayment.toLocaleString("id-ID")}

                        </p>

                        <p>
                            Seller Terima:
                            Rp {sellerReceive.toLocaleString("id-ID")}
                        </p>

                    </div>

                    <textarea
                        placeholder="Catatan transaksi"
                        rows="5"
                        value={notes}
                        onChange={(e) =>
                            setNotes(
                                e.target.value
                            )
                        }
                    ></textarea>

                    <button
                        onClick={createRekber}
                    >
                        Buat Rekber
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Rekber;