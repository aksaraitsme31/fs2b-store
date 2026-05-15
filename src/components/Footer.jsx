import {
    FaTiktok,
    FaInstagram,
    FaFacebookF,
    FaYoutube
} from "react-icons/fa6";

function Footer() {

    return (

        <footer className="footer">

            {/* COPYRIGHT */}
            <div className="footer-copy">

                © 2025 FS2B STORE

            </div>

            {/* LINE */}
            <div className="footer-line"></div>

            {/* FOLLOW */}
            <div className="footer-follow">

                <h3>
                    Follow Us
                </h3>

                <div className="footer-social">

                    {/* TIKTOK */}
                    <a
                        href="https://tiktok.com/@fs2bstore"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaTiktok />
                    </a>

                    {/* INSTAGRAM */}
                    <a
                        href="https://instagram.com/username"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>

                    {/* FACEBOOK */}
                    <a
                        href="https://www.facebook.com/share/179Xon9qm3/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaFacebookF />
                    </a>

                    {/* YOUTUBE */}
                    <a
                        href="https://youtube.com/@username"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaYoutube />
                    </a>

                </div>

            </div>

        </footer>

    );

}

export default Footer;