import Navbar from "../components/Navbar";

import qrisImage from "../assets/qris.jpeg";

import {
    useState
} from "react";

import toast from "react-hot-toast";

import {
    useNavigate
} from "react-router-dom";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

function Rekber() {

    const navigate =
        useNavigate();

    const currentUser =
        auth.currentUser;

    const [
        buyerUsername
    ] = useState(
        currentUser?.displayName || ""
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

            /* CEK LOGIN */
            if (!firebaseUser) {

                toast.error(
                    "Silakan login terlebih dahulu 😀"
                );

                navigate("/login");

                return;

            }

            /* CEK VERIFIKASI EMAIL */
            if (!firebaseUser.emailVerified) {

                toast.error(
                    "Verifikasi email terlebih dahulu 😉"
                );

                return;

            }

            if (
                !buyerUsername ||
                !sellerUsername ||
                !game ||
                !itemName ||
                !dealPrice
            ) {

                toast.error(
                    "Lengkapi data terlebih dahulu 😠"
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
                            .trim()
                            .toLowerCase()
                    )
                );

                const userSnapshot =
                    await getDocs(userQuery);

                if (userSnapshot.empty) {

                    toast.error(
                        "Seller tidak ditemukan 😔"
                    );

                    return;

                }

                const sellerData =
                    userSnapshot.docs[0].data();

                console.log(sellerData);

                const sellerId =
                    sellerData.uid;

                if (
                    sellerId === firebaseUser.uid
                ) {

                    toast.error(
                        "Tidak bisa membuat rekber dengan akun sendiri 😅"
                    );

                    return;

                }

                const transactionId =
                    `FS2B-RKB-${Date.now()}`;

                const newRekber = {

                    transactionId,

                    buyerId:
                        firebaseUser.uid,

                    buyerUsername,

                    sellerId,

                    sellerUsername:
                        sellerUsername
                            .trim()
                            .toLowerCase(),

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
                        serverTimestamp(),

                    date:
                        new Date().toLocaleDateString("id-ID"),

                    time:
                        new Date().toLocaleTimeString("id-ID")

                };

                const docRef =
                    await addDoc(
                        collection(
                            db,
                            "rekberOrders"
                        ),
                        newRekber
                    );

                toast.success(
                    "Rekber berhasil dibuat 🎉"
                );

                navigate(
                    `/rekber/order/${docRef.id}`
                );

            } catch (error) {

                console.log(error);

                toast.error(
                    "Gagal membuat rekber 😩"
                );

            }

        };

    return (

        <div className="store">

            <Navbar />

            <div className="profile-page">

                <div className="profile-section">

                    {/* RULES CARD */}
                    <div className="rekber-flow-card">

                        <h2>
                            📋 PERATURAN REKBER FS2B STORE
                        </h2>

                        <div className="rekber-rules-scroll">

                            <hr className="gold-line" />

                            <p>
                                Dengan menggunakan sistem Rekber FS2B STORE,
                                seluruh pihak dianggap telah membaca,
                                memahami, dan menyetujui seluruh syarat
                                & ketentuan berikut.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                📌 KETENTUAN UMUM
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Pembayaran wajib dikirim kepada admin
                                sebelum transaksi diproses.
                            </p>

                            <p>
                                • Seller hanya diperbolehkan mengirim
                                barang setelah pembayaran diverifikasi admin.
                            </p>

                            <p>
                                • Seller wajib merekam proses pengiriman
                                item dari awal hingga selesai
                                sebagai bukti transaksi.
                            </p>

                            <p>
                                • Buyer disarankan merekam saat menerima
                                item demi keamanan transaksi.
                            </p>

                            <p>
                                • Buyer wajib melakukan konfirmasi melalui tombol:
                                “Barang Sudah Diterima”
                                jika item telah diterima dengan benar.
                            </p>

                            <p>
                                • Seller wajib melakukan konfirmasi melalui tombol:
                                “Barang Sudah Dikirim”
                                setelah pengiriman dilakukan.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                🔒 KEAMANAN TRANSAKSI
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                ✅ Fee dihitung otomatis oleh sistem
                            </p>

                            <p>
                                ✅ Seller wajib terdaftar di FS2B STORE
                            </p>

                            <p>
                                ✅ Bukti pembayaran wajib diupload
                                sebelum verifikasi
                            </p>

                            <p>
                                ✅ Chat transaksi berjalan realtime
                            </p>

                            <p>
                                ✅ Mendukung upload gambar & video
                                sebagai bukti transaksi
                            </p>

                            <p>
                                ✅ Admin otomatis masuk ke room chat transaksi
                            </p>

                            <p>
                                ✅ Status transaksi berjalan realtime
                            </p>

                            <p>
                                ✅ Chat dapat dikunci oleh admin
                            </p>

                            <p>
                                ✅ Buyer & Seller terhubung menggunakan
                                sistem UID akun
                            </p>

                            <p>
                                ✅ Sistem mencegah penyamaran
                                atau cloning admin
                            </p>

                            <p>
                                ✅ Seluruh aktivitas transaksi
                                tercatat otomatis di database sistem
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                ⚠️ HAK ADMIN
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                Admin memiliki hak untuk:
                            </p>

                            <p>
                                • Menyelesaikan transaksi
                            </p>

                            <p>
                                • Menahan transaksi sementara
                            </p>

                            <p>
                                • Mengunci chat transaksi
                            </p>

                            <p>
                                • Meminta bukti tambahan
                            </p>

                            <p>
                                • Mengambil keputusan akhir
                                berdasarkan bukti yang tersedia
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                ⏳ BATAS WAKTU TRANSAKSI
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Maksimal waktu transaksi adalah
                                2 jam setelah pembayaran diverifikasi,
                                kecuali terdapat kesepakatan lain
                                antara kedua pihak.
                            </p>

                            <p>
                                • Jika salah satu pihak tidak memberikan
                                respon dalam batas waktu yang wajar,
                                keputusan akhir berada di tangan admin
                                berdasarkan bukti transaksi.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                🚫 LARANGAN
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                Dilarang melakukan:
                            </p>

                            <p>
                                • Penipuan transaksi
                            </p>

                            <p>
                                • Pemalsuan bukti transfer
                                atau bukti pengiriman
                            </p>

                            <p>
                                • Penyalahgunaan sistem rekber
                            </p>

                            <p>
                                • Spam chat transaksi
                            </p>

                            <p>
                                • Tindakan yang merugikan pihak lain
                            </p>

                            <p>
                                • Pelanggaran dapat menyebabkan akun
                                dibatasi atau diblokir permanen
                                dari sistem FS2B STORE.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                📌 CATATAN PENTING
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Pastikan seluruh data transaksi
                                sudah benar sebelum membuat rekber.
                            </p>

                            <p>
                                • Setelah rekber dibuat,
                                sistem otomatis menghubungkan
                                Buyer, Seller, dan Admin
                                ke room chat transaksi.
                            </p>

                            <p>
                                • Gunakan chat transaksi hanya
                                untuk keperluan transaksi terkait.
                            </p>

                            <p>
                                • Tidak ada bukti atau rekaman transaksi
                                = risiko ditanggung masing-masing pihak.
                            </p>

                            <p>
                                • Dengan melanjutkan transaksi,
                                seluruh pihak dianggap telah membaca,
                                memahami, dan menyetujui seluruh
                                peraturan dan sistem rekber
                                FS2B STORE.
                            </p>

                        </div>

                    </div>

                    <div className="rekber-flow-card">

                        <h2>
                            📋 FLOW REKBER FS2B STORE
                        </h2>

                        <div className="rekber-rules-scroll">

                            <hr className="gold-line" />

                            <p>
                                FS2B STORE menggunakan sistem Rekber otomatis
                                untuk menjaga keamanan transaksi
                                antara Buyer dan Seller.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                1️⃣ BUYER MEMBUAT REKBER
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Buyer login ke akun FS2B STORE.
                            </p>

                            <p>
                                • Buyer mengisi data transaksi:
                            </p>

                            <p>
                                - Username Seller
                                <br />
                                - Game
                                <br />
                                - Nama Item
                                <br />
                                - Harga Deal
                                <br />
                                - Jenis Fee Rekber (INC / EXC)
                            </p>

                            <p>
                                • Sistem otomatis menghitung:
                            </p>

                            <p>
                                - Fee Rekber
                                <br />
                                - Total Pembayaran
                                <br />
                                - Jumlah yang diterima Seller
                            </p>

                            <p>
                                • Setelah data valid,
                                sistem membuat transaksi dengan status:
                            </p>

                            <p>
                                “Menunggu Pembayaran”
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                2️⃣ BUYER MELAKUKAN PEMBAYARAN
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Buyer masuk ke halaman detail rekber.
                            </p>

                            <p>
                                • Sistem menampilkan:
                            </p>

                            <p>
                                - Detail transaksi
                                <br />
                                - Ringkasan pembayaran
                                <br />
                                - QRIS pembayaran
                            </p>

                            <p>
                                • Buyer melakukan pembayaran
                                sesuai total transaksi.
                            </p>

                            <p>
                                • Buyer wajib mengupload bukti transfer.
                            </p>

                            <p>
                                • Setelah bukti dikirim,
                                status berubah menjadi:
                            </p>

                            <p>
                                “Menunggu Verifikasi Pembayaran”
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                3️⃣ ADMIN VERIFIKASI PEMBAYARAN
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Admin memeriksa bukti transfer buyer.
                            </p>

                            <p>
                                • Jika pembayaran valid:
                            </p>

                            <p>
                                - Payment Status → “Sudah Diverifikasi”
                                <br />
                                - Status Rekber →
                                “Menunggu Seller Mengirim Barang”
                            </p>

                            <p>
                                • Setelah pembayaran diverifikasi,
                                seller diperbolehkan mengirim barang.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                4️⃣ SELLER MENGIRIM BARANG
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Seller masuk ke halaman Rekber Saya.
                            </p>

                            <p>
                                • Seller melihat transaksi yang masuk.
                            </p>

                            <p>
                                • Seller mengirim item/barang kepada buyer.
                            </p>

                            <p>
                                • Setelah pengiriman selesai,
                                seller wajib menekan tombol:
                            </p>

                            <p>
                                “Barang Sudah Dikirim”
                            </p>

                            <p>
                                • Status berubah menjadi:
                            </p>

                            <p>
                                “Seller Sudah Mengirim Barang”
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                5️⃣ BUYER MENERIMA BARANG
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Buyer menerima item/barang dari seller.
                            </p>

                            <p>
                                • Buyer melakukan pengecekan item.
                            </p>

                            <p>
                                • Jika item sudah sesuai,
                                buyer wajib menekan tombol:
                            </p>

                            <p>
                                “Barang Sudah Diterima”
                            </p>

                            <p>
                                • Status berubah menjadi:
                            </p>

                            <p>
                                “Barang Sudah Diterima Buyer”
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                6️⃣ ADMIN MENYELESAIKAN REKBER
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Admin melakukan pengecekan akhir transaksi.
                            </p>

                            <p>
                                • Jika seluruh proses valid dan selesai:
                            </p>

                            <p>
                                - Status rekber berubah menjadi:
                            </p>

                            <p>
                                “DONE”
                            </p>

                            <p>
                                • Transaksi dinyatakan selesai.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                💬 SISTEM CHAT TRANSAKSI
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                • Buyer, Seller, dan Admin otomatis
                                terhubung ke room chat transaksi.
                            </p>

                            <p>
                                • Chat mendukung:
                            </p>

                            <p>
                                - Pesan teks realtime
                                <br />
                                - Upload gambar
                                <br />
                                - Upload video
                            </p>

                            <p>
                                • Admin dapat:
                            </p>

                            <p>
                                - Memantau seluruh transaksi
                                <br />
                                - Mengunci chat transaksi
                                <br />
                                - Menjadi penengah jika terjadi kendala
                            </p>

                            <p>
                                • Seluruh aktivitas transaksi
                                tercatat otomatis di sistem
                                untuk keamanan.
                            </p>

                            <hr className="gold-line" />

                            <h3>
                                📌 STATUS FLOW REKBER
                            </h3>

                            <hr className="gold-line" />

                            <p>
                                Menunggu Pembayaran
                                <br />
                                ↓
                                <br />
                                Menunggu Verifikasi Pembayaran
                                <br />
                                ↓
                                <br />
                                Menunggu Seller Mengirim Barang
                                <br />
                                ↓
                                <br />
                                Seller Sudah Mengirim Barang
                                <br />
                                ↓
                                <br />
                                Barang Sudah Diterima Buyer
                                <br />
                                ↓
                                <br />
                                DONE
                            </p>

                        </div>

                    </div>

                    <div className="rekber-form-header">

                        <div className="rekber-form-glow"></div>

                        <h2 className="rekber-form-title">
                            📋 Formulir Rekber FS2B STORE 📋
                        </h2>

                        <p className="rekber-form-subtitle">
                            Lengkapi data transaksi dengan benar
                            sebelum membuat rekber.
                        </p>

                    </div>

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
                        type="number"
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