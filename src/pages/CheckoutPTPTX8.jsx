import Navbar from "../components/Navbar";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import {
    auth
} from "../firebase/firebase";

import toast from "react-hot-toast";

function CheckoutPTPTX8() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const event = state?.event;

    const [username, setUsername] = useState("");

    if (!event) {

        return (

            <div className="store">

                <Navbar />

                <div className="checkout-event">

                    <div className="checkout-card">

                        <h2>
                            ⚠ Event Tidak Ditemukan
                        </h2>

                        <p className="checkout-desc">

                            Event yang ingin kamu akses tidak tersedia
                            atau halaman sudah kedaluwarsa.

                        </p>

                        <button

                            className="checkout-btn"

                            onClick={() => navigate("/")}

                        >

                            Kembali ke Beranda

                        </button>

                    </div>

                </div>

            </div>

        );

    }

    const handleContinue = () => {

        const currentUser = auth.currentUser;

        if (!currentUser) {

            toast.error("Silakan login terlebih dahulu 😀");

            navigate("/login");

            return;

        }

        if (!currentUser.emailVerified) {

            toast.error("Verifikasi email terlebih dahulu 😉");

            return;

        }

        if (!username.trim()) {

            toast.error("Masukkan Username Roblox 😄");

            return;

        }

        navigate(

            "/payment-ptptx8",

            {

                state: {

                    event,

                    username

                }

            }

        );

    };

    return (

        <div className="store">

            <Navbar />

            <div className="checkout-event">

                <div className="checkout-card">

                    <div className="checkout-top">

                        <h2>

                            🎣 PT PT X8 EVENT

                        </h2>

                        <p>

                            Satu langkah lagi menuju pendaftaran event.
                            Pastikan seluruh data sudah benar sebelum
                            melakukan pembayaran.

                        </p>

                    </div>

                    <div className="checkout-info">

                        <div>

                            <span>
                                🎣 Nama Event
                            </span>

                            <strong>

                                {event.title}

                            </strong>

                        </div>

                        <div>

                            <span>
                                📅 Jadwal
                            </span>

                            <strong>

                                {event.eventDate}

                            </strong>

                        </div>

                        <div>

                            <span>
                                🕒 Jam Mulai
                            </span>

                            <strong>

                                {event.startTime}

                            </strong>

                        </div>

                        <div>

                            <span>
                                👑 Host
                            </span>

                            <strong>

                                {event.host}

                            </strong>

                        </div>

                        <div>

                            <span>
                                👥 Slot
                            </span>

                            <strong>

                                {event.maxParticipants} Peserta

                            </strong>

                        </div>

                        <div>

                            <span>
                                💰 Harga

                            </span>

                            <strong
                                style={{
                                    color: "#ffd54f"
                                }}
                            >

                                Rp{" "}

                                {Number(

                                    event.price || 0

                                ).toLocaleString("id-ID")}

                            </strong>

                        </div>

                    </div>

                    <div className="checkout-form">

                        <label>

                            Username Roblox

                        </label>

                        <input

                            type="text"

                            placeholder="Masukkan Username Roblox"

                            value={username}

                            onChange={(e) =>
                                setUsername(e.target.value)
                            }

                        />

                    </div>

                    <div className="checkout-status">

                        <strong>

                            📢 Informasi Penting

                        </strong>

                        <ul>

                            <li>

                                Username Roblox wajib benar.

                            </li>

                            <li>

                                Setelah pembayaran diverifikasi,
                                nama peserta otomatis masuk
                                ke daftar peserta event.

                            </li>

                            <li>

                                Peserta wajib hadir
                                minimal 10 menit
                                sebelum event dimulai.

                            </li>

                            <li>

                                Kesalahan username
                                menjadi tanggung jawab peserta.

                            </li>

                        </ul>

                    </div>

                    <button

                        className="checkout-btn"

                        onClick={handleContinue}

                    >

                        💳 LANJUT KE PEMBAYARAN

                    </button>

                    <button

                        className="checkout-back-btn"

                        onClick={() => navigate(-1)}

                    >

                        ← Kembali

                    </button>

                </div>

            </div>

        </div>

    );

}

export default CheckoutPTPTX8;