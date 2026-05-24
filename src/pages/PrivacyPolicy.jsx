import Navbar from "../components/Navbar";
import LiveChat from "../components/LiveChat";

import {
    ShieldCheck,
    Database,
    Lock,
    Eye,
    UserCheck,
    Mail
} from "lucide-react";

function PrivacyPolicy() {

    return (

        <>

            <Navbar />

            <div className="privacy-page">

                {/* HERO */}
                <section className="privacy-hero">

                    <div className="privacy-overlay"></div>

                    <div className="privacy-content">

                        <span className="privacy-badge">
                            PRIVACY POLICY
                        </span>

                        <h1>
                            Kebijakan Privasi
                        </h1>

                        <p>
                            FS2B STORE berkomitmen menjaga keamanan,
                            kenyamanan, dan kerahasiaan seluruh data pengguna
                            selama menggunakan layanan kami.
                        </p>

                    </div>

                </section>

                {/* CONTENT */}
                <section className="privacy-section">

                    <div className="privacy-container">

                        {/* 1 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <Database size={34} />
                            </div>

                            <div>

                                <h2>
                                    Informasi Yang Kami Kumpulkan
                                </h2>

                                <p>
                                    FS2B STORE dapat mengumpulkan data pengguna
                                    seperti username, email, riwayat transaksi,
                                    dan informasi lain yang diperlukan
                                    untuk menjalankan layanan website.
                                </p>

                            </div>

                        </div>

                        {/* 2 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <Eye size={34} />
                            </div>

                            <div>

                                <h2>
                                    Penggunaan Informasi
                                </h2>

                                <p>
                                    Informasi pengguna digunakan untuk
                                    memproses transaksi, meningkatkan keamanan,
                                    memberikan layanan customer support,
                                    serta meningkatkan kualitas layanan
                                    FS2B STORE.
                                </p>

                            </div>

                        </div>

                        {/* 3 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <ShieldCheck size={34} />
                            </div>

                            <div>

                                <h2>
                                    Keamanan Data Pengguna
                                </h2>

                                <p>
                                    Kami berusaha menjaga keamanan data pengguna
                                    menggunakan sistem keamanan yang tersedia.
                                    Namun pengguna juga wajib menjaga
                                    keamanan akun dan password masing-masing.
                                </p>

                            </div>

                        </div>

                        {/* 4 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <Lock size={34} />
                            </div>

                            <div>

                                <h2>
                                    Kerahasiaan Transaksi
                                </h2>

                                <p>
                                    Seluruh transaksi pengguna bersifat pribadi
                                    dan tidak akan diperjualbelikan ataupun disalahgunakan.
                                    FS2B STORE dapat menggunakan layanan pihak ketiga tertentu
                                    untuk membantu operasional website seperti sistem notifikasi,
                                    monitoring, dan keamanan layanan dengan tetap menjaga
                                    kerahasiaan data pengguna.
                                </p>

                            </div>

                        </div>

                        {/* 5 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <UserCheck size={34} />
                            </div>

                            <div>

                                <h2>
                                    Tanggung Jawab Pengguna
                                </h2>

                                <p>
                                    Pengguna bertanggung jawab atas keamanan akun,
                                    kebenaran data yang diberikan,
                                    serta aktivitas yang dilakukan menggunakan akun mereka.
                                </p>

                            </div>

                        </div>

                        {/* 6 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <ShieldCheck size={34} />
                            </div>

                            <div>

                                <h2>
                                    Layanan Pihak Ketiga
                                </h2>

                                <p>
                                    FS2B STORE dapat menggunakan layanan pihak ketiga
                                    seperti Firebase, Vercel, dan layanan pendukung lainnya
                                    untuk membantu operasional website dan penyimpanan data pengguna
                                    dengan tetap mengutamakan keamanan informasi pengguna.
                                </p>

                            </div>

                        </div>

                        {/* 7 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <UserCheck size={34} />
                            </div>

                            <div>

                                <h2>
                                    Batasan Penggunaan
                                </h2>

                                <p>
                                    Pengguna dilarang menggunakan layanan FS2B STORE
                                    untuk aktivitas ilegal, penipuan, spam,
                                    atau tindakan yang merugikan pihak lain.
                                    Kami berhak membatasi atau menonaktifkan akun
                                    yang melanggar aturan platform.
                                </p>

                            </div>

                        </div>

                        {/* 8 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <Eye size={34} />
                            </div>

                            <div>

                                <h2>
                                    Perubahan Kebijakan
                                </h2>

                                <p>
                                    Kebijakan privasi dapat diperbarui sewaktu-waktu
                                    tanpa pemberitahuan sebelumnya.
                                    Pengguna disarankan untuk memeriksa halaman ini
                                    secara berkala agar tetap mengetahui perubahan terbaru.
                                </p>

                            </div>

                        </div>

                        {/* 9 */}
                        <div className="privacy-card">

                            <div className="privacy-icon">
                                <Mail size={34} />
                            </div>

                            <div>

                                <h2>
                                    Kontak Kami
                                </h2>

                                <p>
                                    Jika memiliki pertanyaan terkait kebijakan privasi,
                                    silakan hubungi kami melalui:
                                    <br /><br />

                                    Email:
                                    <br />
                                    <b>
                                        fs2bsupport@gmail.com
                                    </b>

                                    <br /><br />

                                    WhatsApp:
                                    <br />
                                    <b>
                                        +62 882-1531-1785
                                    </b>

                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

            <LiveChat />

        </>

    );

}

export default PrivacyPolicy;