import { useNavigate } from "react-router-dom";
import iconstore from "../assets/iconstore.png";

import {
    FaTiktok,
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaWhatsapp
} from "react-icons/fa6";

import {
    Mail
} from "lucide-react";

function Footer() {

    const navigate = useNavigate();

    return (

        <footer className="footer">

            {/* TOP */}
            <div className="footer-grid">

                {/* BRAND */}
                <div className="footer-brand">

                    <img
                        src={iconstore}
                        alt="FS2B STORE"
                        className="footer-logo"
                    />

                    <p>
                        Platform digital terpercaya untuk memenuhi berbagai kebutuhan gaming Anda, seperti beli item game, hingga jasa rekber dengan sistem transaksi yang aman dan jelas, serta layanan yang cepat, terpercaya, dan profesional.
                    </p>

                    <div className="footer-social">

                        <a
                            href="https://tiktok.com/@fs2bstore"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaTiktok />
                        </a>

                        <a
                            href="https://www.instagram.com/fs2bstore"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="https://www.facebook.com/share/179Xon9qm3/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="https://youtube.com/@username"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaYoutube />
                        </a>

                    </div>

                </div>

                {/* PRODUK */}
                <div className="footer-column">

                    <h3>
                        Produk & Layanan
                    </h3>

                    <button onClick={() => navigate("/")}>
                        Item Game
                    </button>

                    <button onClick={() => navigate("/rekber")}>
                        Rekber
                    </button>

                    <button>
                        Joki Game
                    </button>

                </div>

                {/* BANTUAN */}
                <div className="footer-column">

                    <h3>
                        Bantuan
                    </h3>

                    <button>
                        Livechat
                    </button>

                </div>

                {/* INFORMASI */}
                <div className="footer-column">

                    <h3>
                        Informasi
                    </h3>

                    <button
                        onClick={() => navigate("/tentang-kami")}
                    >
                        Tentang Kami
                    </button>

                    <button>
                        Cara Belanja
                    </button>

                    <button>
                        Cara Rekber
                    </button>

                    <button>
                        Kebijakan Privasi
                    </button>

                    <button>
                        FAQ
                    </button>

                </div>

                {/* KONTAK */}
                <div className="footer-column">

                    <h3>
                        Kontak
                    </h3>

                    <a
                        href="https://wa.me/6288215311785"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-contact"
                    >
                        <FaWhatsapp />
                        +62 882-1531-1785
                    </a>

                    <a
                        href="mailto:fs2bsupport@gmail.com"
                        className="footer-contact"
                    >
                        <Mail size={18} />
                        fs2bsupport@gmail.com
                    </a>

                </div>

            </div>

            {/* COPYRIGHT */}
            <div className="footer-bottom">

                © 2025 FS2B STORE — All Rights Reserved

            </div>

        </footer>

    );

}

export default Footer;