import Navbar from "../components/Navbar";
import LiveChat from "../components/LiveChat";

import { useState } from "react";

import {
    ChevronDown,
    ShieldCheck,
    CreditCard,
    Search,
    MailCheck,
    MessageCircleQuestion,
    UserCheck,
    Clock3,
    PackageCheck
} from "lucide-react";

function FAQ() {

    const [openIndex, setOpenIndex] =
        useState(null);

    const faqData = [

        {
            icon: <ShieldCheck size={24} />,
            question:
                "Apa itu FS2B STORE?",
            answer:
                "FS2B STORE adalah platform digital gaming yang menyediakan layanan jual beli item game dan rekber dengan sistem transaksi yang aman, cepat, dan terpercaya."
        },

        {
            icon: <CreditCard size={24} />,
            question:
                "Bagaimana cara membeli item di FS2B STORE?",
            answer:
                "Pilih menu Beli Item Game, pilih game dan kategori item, pilih item yang diinginkan, tentukan jumlah item, klik checkout, lakukan pembayaran, lalu tunggu proses transaksi selesai."
        },

        {
            icon: <ShieldCheck size={24} />,
            question:
                "Apa itu layanan Rekber FS2B STORE?",
            answer:
                "Rekber (Rekening Bersama) adalah layanan perantara transaksi antara buyer dan seller untuk membantu mengurangi risiko penipuan saat transaksi digital."
        },

        {
            icon: <ShieldCheck size={24} />,
            question:
                "Bagaimana alur transaksi Rekber di FS2B STORE?",
            answer:
                "Buyer dan seller sepakat melakukan transaksi, transaksi dibuat melalui layanan rekber FS2B STORE, buyer melakukan pembayaran, seller menyerahkan item atau akun, buyer melakukan konfirmasi, lalu dana diteruskan ke seller setelah transaksi selesai."
        },

        {
            icon: <Search size={24} />,
            question:
                "Bagaimana cara melacak transaksi?",
            answer:
                "Gunakan fitur Lacak Transaksi lalu masukkan ID transaksi yang diberikan saat checkout atau saat transaksi rekber dibuat."
        },

        {
            icon: <UserCheck size={24} />,
            question:
                "Kenapa saya harus login sebelum transaksi?",
            answer:
                "Akun diperlukan untuk menyimpan riwayat transaksi, meningkatkan keamanan pengguna, mempermudah tracking transaksi, dan mengurangi penyalahgunaan sistem."
        },

        {
            icon: <MailCheck size={24} />,
            question:
                "Kenapa email harus diverifikasi?",
            answer:
                "Verifikasi email digunakan untuk mengamankan akun pengguna, mencegah akun spam atau fake account, memastikan email pengguna valid, dan membantu proses recovery akun."
        },

        {
            icon: <MessageCircleQuestion size={24} />,
            question:
                "Saya tidak menerima email verifikasi, bagaimana?",
            answer:
                "Silakan periksa folder Spam atau Junk, pastikan email yang dimasukkan benar, tunggu beberapa menit, lalu login kembali untuk mengirim ulang verifikasi email."
        },

        {
            icon: <ShieldCheck size={24} />,
            question:
                "Apakah transaksi di FS2B STORE aman?",
            answer:
                "Ya. FS2B STORE menggunakan sistem transaksi yang jelas dan terpantau. Untuk layanan rekber, admin bertindak sebagai pihak penengah agar transaksi lebih aman dan terpercaya."
        },

        {
            icon: <Clock3 size={24} />,
            question:
                "Berapa lama proses transaksi?",
            answer:
                "Waktu transaksi tergantung antrean dan jenis layanan. Sebagian besar transaksi diproses secepat mungkin oleh admin FS2B STORE."
        },

        {
            icon: <ShieldCheck size={24} />,
            question:
                "Apakah data pengguna aman?",
            answer:
                "Ya. FS2B STORE menjaga kerahasiaan data pengguna dan tidak memperjualbelikan data pribadi pengguna kepada pihak lain."
        },

        {
            icon: <PackageCheck size={24} />,
            question:
                "Kenapa status transaksi saya masih Diproses?",
            answer:
                "Status Diproses berarti admin sedang menangani transaksi Anda. Mohon menunggu hingga transaksi selesai diproses."
        },

        {
            icon: <MessageCircleQuestion size={24} />,
            question:
                "Apakah transaksi bisa dibatalkan?",
            answer:
                "Pembatalan transaksi tergantung kondisi transaksi yang sedang berlangsung. Silakan hubungi admin FS2B STORE untuk pengecekan lebih lanjut."
        },

        {
            icon: <MessageCircleQuestion size={24} />,
            question:
                "Apakah saya bisa langsung chat admin?",
            answer:
                "Bisa. Anda dapat menggunakan fitur Livechat website, WhatsApp, maupun Instagram FS2B STORE."
        },

        {
            icon: <CreditCard size={24} />,
            question:
                "Metode pembayaran apa yang tersedia?",
            answer:
                "Metode pembayaran dapat berubah sewaktu-waktu sesuai layanan yang tersedia seperti QRIS, Dana, transfer bank, dan e-wallet lainnya."
        },

        {
            icon: <MessageCircleQuestion size={24} />,
            question:
                "Apakah FS2B STORE menerima kritik dan saran?",
            answer:
                "Tentu. FS2B STORE selalu terbuka terhadap kritik dan saran demi meningkatkan kualitas layanan menjadi lebih baik."
        },

        {
            icon: <Clock3 size={24} />,
            question:
                "Apakah website FS2B STORE tersedia 24 jam?",
            answer:
                "Website dapat diakses kapan saja, namun respon admin dan proses transaksi mengikuti jam operasional yang tersedia."
        }

    ];

    return (

        <>

            <Navbar />

            <div className="faq-page">

                {/* HERO */}
                <section className="faq-hero">

                    <div className="faq-overlay"></div>

                    <div className="faq-content">

                        <span className="faq-badge">
                            FS2B STORE HELP CENTER
                        </span>

                        <h1>
                            Frequently Asked Questions
                        </h1>

                        <p>
                            Temukan jawaban dari pertanyaan
                            yang paling sering ditanyakan
                            pengguna FS2B STORE.
                        </p>

                    </div>

                </section>

                {/* FAQ */}
                <section className="faq-section">

                    <div className="faq-container">

                        {faqData.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className={`faq-card ${
                                        openIndex === index
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <button
                                        className="faq-question"

                                        onClick={() =>
                                            setOpenIndex(
                                                openIndex === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                    >

                                        <div className="faq-left">

                                            <div className="faq-icon">
                                                {item.icon}
                                            </div>

                                            <h3>
                                                {item.question}
                                            </h3>

                                        </div>

                                        <ChevronDown
                                            className={`faq-arrow ${
                                                openIndex === index
                                                    ? "rotate"
                                                    : ""
                                            }`}
                                        />

                                    </button>

                                    <div
                                        className={`faq-answer ${
                                            openIndex === index
                                                ? "show"
                                                : ""
                                        }`}
                                    >

                                        <p>
                                            {item.answer}
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </section>

            </div>

            <LiveChat />

        </>

    );

}

export default FAQ;