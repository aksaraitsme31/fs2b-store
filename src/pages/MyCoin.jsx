import Navbar from "../components/Navbar";

import {
    useState,
    useEffect
} from "react";

import {
    doc,
    onSnapshot
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

            </section>

        </div>

    );

}

export default MyCoin;