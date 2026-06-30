import Navbar from "../components/Navbar";

import {
    useState,
    useEffect
} from "react";

import {
    doc,
    onSnapshot,
    collection,
    query,
    orderBy
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

import coinFront from "../assets/fs2b-coin-front.png";
import coinBack from "../assets/fs2b-coin-back.png";

function MyCoin() {

    const [coin, setCoin] =
        useState(0);

    const [username, setUsername] = useState("");

    const [isFlipped, setIsFlipped] = useState(false);

    const [coinHistory, setCoinHistory] = useState([]);

    useEffect(() => {

        const unsubscribeAuth =
            auth.onAuthStateChanged(
                (user) => {

                    if (!user) {

                        setCoin(0);
                        setUsername("");

                        return;

                    }

                    const unsubscribeUser =
                        onSnapshot(
                            doc(
                                db,
                                "users",
                                user.uid
                            ),
                            (snap) => {

                                if (
                                    snap.exists()
                                ) {

                                    const userData =
                                        snap.data();

                                    setCoin(
                                        userData.coin || 0
                                    );

                                    setUsername(
                                        userData.username?.trim() ||
                                        "User"
                                    );

                                    const historyQuery = query(
                                        collection(
                                            db,
                                            "users",
                                            user.uid,
                                            "coinHistory"
                                        ),
                                        orderBy("createdAt", "desc")
                                    );

                                    onSnapshot(
                                        historyQuery,
                                        (historySnap) => {

                                            const historyData =
                                                historySnap.docs.map(
                                                    (doc) => ({
                                                        id: doc.id,
                                                        ...doc.data()
                                                    })
                                                );

                                            setCoinHistory(
                                                historyData
                                            );

                                        }
                                    );

                                } else {

                                    setCoin(0);

                                    setUsername(
                                        "User"
                                    );

                                }

                            },
                            (error) => {

                                console.error(
                                    "Error mengambil data user:",
                                    error
                                );

                            }
                        );

                    return () =>
                        unsubscribeUser();

                }
            );

        return () =>
            unsubscribeAuth();

    }, []);

    return (

        <div className="store">

            <Navbar />

            <section className="products-section">

                <h2
                    style={{
                        textAlign:
                            "center",
                        marginBottom:
                            "30px"
                    }}
                >
                    FS2B Coin Wallet
                </h2>

                <div
                    className="coin-card"
                >

                    <div
                        className="coin-glow"
                    />

                    <div
                        className="coin-top"
                    >

                        <span>
                            My Balance
                        </span>

                        <span>
                            FS2B CARD
                        </span>

                    </div>

                    <div className="coin-amount">

                        <div
                            className={`coin-logo ${isFlipped ? "flipped" : ""
                                }`}
                            onClick={() =>
                                setIsFlipped(!isFlipped)
                            }
                        >
                            <div className="coin-logo-inner">

                                <div className="coin-face front">
                                    <img
                                        src={coinFront}
                                        alt="FS2B Coin"
                                    />
                                </div>

                                <div className="coin-face back">
                                    <img
                                        src={coinBack}
                                        alt="FS2B Coin Back"
                                    />
                                </div>

                            </div>
                        </div>

                        <span>
                            {coin.toLocaleString("id-ID")}
                        </span>

                    </div>

                    <div
                        className="coin-label"
                    >
                        FS2B COIN
                    </div>

                    <div
                        className="coin-footer"
                    >

                        <div>

                            <small>
                                Name
                            </small>

                            <p>
                                {username}
                            </p>

                        </div>

                        <div>

                            <small>
                                Status
                            </small>

                            <p>
                                Active
                            </p>

                        </div>

                    </div>

                </div>

                <div
                    className="coin-info"
                >

                    <h3>
                        Cara Mendapatkan Coin
                    </h3>

                    <ul>

                        <li>
                            ⭐ Memberikan
                            feedback setelah
                            pesanan selesai
                        </li>

                        <li>
                            🎉 Mengikuti
                            event FS2B
                        </li>

                        <li>
                            💎 Reward dari
                            admin
                        </li>

                    </ul>

                </div>

                <div className="coin-history">

                    <div className="coin-history-header">

                        <h3>
                            Riwayat Coin
                        </h3>

                        <span className="coin-history-count">
                            {coinHistory.length} Aktivitas
                        </span>

                    </div>

                    <div className="coin-history-list">

                        {
                            coinHistory.length === 0 ? (

                                <div className="coin-history-empty">

                                    <span>
                                        🪙
                                    </span>

                                    <p>
                                        Belum ada riwayat coin
                                    </p>

                                </div>

                            ) : (

                                coinHistory.map(
                                    (item) => (

                                        <div
                                            key={item.id}
                                            className="coin-history-item"
                                        >

                                            <div className="coin-history-left">

                                                <strong>
                                                    {item.description}
                                                </strong>

                                                <p>
                                                    {item.product || "FS2B Store"}
                                                </p>

                                                <small>

                                                    {
                                                        item.createdAt?.toDate?.().toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric"
                                                            }
                                                        )
                                                    }

                                                </small>

                                            </div>

                                            <div className="coin-history-right">

                                                <span
                                                    className={
                                                        item.amount > 0
                                                            ? "coin-plus"
                                                            : "coin-minus"
                                                    }
                                                >

                                                    {
                                                        item.amount > 0
                                                            ? "+"
                                                            : ""
                                                    }

                                                    {
                                                        item.amount.toLocaleString("id-ID")
                                                    }

                                                </span>

                                                <small>
                                                    Coin
                                                </small>

                                            </div>

                                        </div>

                                    )
                                )

                            )
                        }

                    </div>

                </div>

            </section>

        </div>

    );

}

export default MyCoin;