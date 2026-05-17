import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LiveChat from "../components/LiveChat";

import { motion } from "framer-motion";


import {
  ShieldCheck,
  Handshake,
  Speech,
  Headphones,
  Rocket,
  Target,
} from "lucide-react";

import aboutBanner from "../assets/about-banner.jpg";
import founderImage from "../assets/founder.jpg";
import adminImage from "../assets/admin.jpg";

export default function TentangKami() {

  const navigate = useNavigate();

  return (

    <>

      <Navbar />

      <div className="tentang-page">

        {/* HERO */}
        <section
          className="tentang-hero"
          style={{
            backgroundImage: `url(${aboutBanner})`,
          }}
        >

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <motion.div
              className="hero-inner"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              <span className="hero-badge">
                TENTANG FS2B STORE
              </span>

              <h1>
                Digital Gaming
                <br />
                Platform
              </h1>

              <p>
                FS2B STORE adalah platform digital
                yang menyediakan item game, layanan rekber,
                dan berbagai kebutuhan gaming lainnya.
                setiap transaksi menggunakan
                sistem yang aman, cepat, dan terpercaya.
              </p>

              <div className="hero-buttons">

                <button
                  className="hero-btn primary"
                  onClick={() => navigate("/")}
                >
                  Explore Store
                </button>

                <button className="hero-btn secondary">
                  Contact Us
                </button>

              </div>

            </motion.div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="tentang-features">

          <h2>
            Kenapa Memilih
            <span> FS2B STORE?</span>
          </h2>

          <div className="feature-grid">

            <motion.div
              whileHover={{ y: -8 }}
              className="feature-card"
            >

              <ShieldCheck size={42} />

              <h3>Aman & Terpercaya</h3>

              <p>
                Sistem keamanan berlapis
                dengan proses transaksi yang aman & transparan.
              </p>

            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="feature-card"
            >

              <Handshake size={42} />

              <h3>Rekber Profesional</h3>

              <p>
                Layanan rekber cepat, Aman, terhindar dari cloning, adil,
                dan terpercaya.
              </p>

            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="feature-card"
            >

              <Speech size={42} />

              <h3>Terbuka Untuk Masukan</h3>

              <p>
                Kami selalu siap menerima
                kritik dan saran dari kalian.
              </p>

            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="feature-card"
            >

              <Headphones size={42} />

              <h3>Livechat 24/7</h3>

              <p>
                Tim support siap membantu
                kapanpun kamu butuh.
              </p>

            </motion.div>

          </div>

        </section>

        {/* MISSION */}
        <section className="tentang-mission">

          <div className="mission-box">

            <div className="mission-item">

              <Target size={55} />

              <div>

                <h3>Visi Kami</h3>

                <p>
                  Menjadi platform transaksi gaming digital
                  yang aman, terpercaya, dan nyaman sehingga
                  membantu para gamer terhindar dari penipuan
                  dan scam dalam jual beli digital.
                </p>

              </div>

            </div>

            <div className="mission-divider"></div>

            <div className="mission-item">

              <Rocket size={55} />

              <div>

                <h3>Misi Kami</h3>

                <ul className="mission-list">

                  <li>
                    Menghadirkan sistem transaksi yang aman,
                    transparan, dan terpercaya.
                  </li>

                  <li>
                    Menyediakan item game dan kebutuhan gaming
                    dengan pelayanan terbaik dan terpercaya.
                  </li>

                  <li>
                    Memberikan layanan rekber profesional
                    untuk meningkatkan keamanan buyer dan seller.
                  </li>

                  <li>
                    Membangun reputasi platform yang jujur,
                    responsif, dan mengutamakan kepuasan customer.
                  </li>

                  <li>
                    Membantu menciptakan lingkungan transaksi
                    gaming yang lebih aman dan terhindar dari penipuan.
                  </li>

                  <li>
                    Menjadi tempat transaksi digital yang nyaman
                    bagi seluruh komunitas gamer di muka bumi.
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </section>

        {/* FOUNDER & TEAM */}
        <section className="tentang-founder">

          <div className="founder-header">

            <span className="founder-badge">
              FOUNDER & TEAM
            </span>

            <h2>
              Orang Dibalik
              <span> FS2B STORE</span>
            </h2>

            <p>
              FS2B STORE dibangun dengan tujuan
              menciptakan tempat transaksi gaming
              yang lebih aman, nyaman, dan minim penipuan.
            </p>

          </div>

          <div className="founder-grid">

            {/* FOUNDER CARD*/}
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >

              <div className="founder-image-wrap">

                <img
                  src={founderImage}
                  alt="Founder FS2B"
                  className="founder-image"
                />

                <div className="founder-online"></div>

              </div>

              <div className="founder-info">

                <span className="founder-role">
                  Founder & Developer FS2B STORE
                </span>

                <h3>
                  Athfal Kurniawan S (TAPULIMUT)
                </h3>

                <p>
                  Membangun dan mengembangkan platform FS2B Store,
                  mengelola transaksi, serta memastikan kualitas layanan
                  demi menghadirkan pengalaman transaksi gaming
                  yang aman, cepat, dan terpercaya.
                </p>

                <div className="profile-location">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>

                  <span>
                    Purwokerto, Banyumas, Jawa Tengah
                  </span>

                </div>

              </div>

            </motion.div>

            {/* CONNECTOR */}
            <div className="founder-connector">

              <div className="connector-line"></div>

              <div className="connector-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </div>

              <div className="connector-line"></div>

            </div>

            {/* ADMIN CARD */}
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >

              <div className="founder-image-wrap">

                <img
                  src={adminImage}
                  alt="Admin FS2B"
                  className="founder-image"
                />

                <div className="founder-online"></div>

              </div>

              <div className="founder-info">

                <span className="founder-role">
                  Admin FS2B STORE
                </span>

                <h3>
                  Aufa Hisyam (PEY)
                </h3>

                <p>
                  Membantu mengelola transaksi customer,
                  memberikan pelayanan terbaik,
                  serta menjaga kenyamanan dan keamanan
                  selama proses transaksi berlangsung.
                </p>

                <div className="profile-location">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>

                  <span>
                    Purwokerto, Banyumas, Jawa Tengah
                  </span>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

      </div>

      <LiveChat />

    </>

  );

}