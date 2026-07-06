import Navbar from "../components/Navbar";

import LiveChat from "../components/LiveChat";

import iconstore from "../assets/iconstore.png";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import { formatPrice } from "../utils/formatPrice";

import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

function Store() {

  const [products, setProducts] =
    useState([]);

  const [totalTransactions, setTotalTransactions] =
    useState(0);

  const [
    verifiedUsers,
    setVerifiedUsers
  ] = useState(0);

  const [
    testimonials,
    setTestimonials
  ] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const testimonialsPerPage = 4;

  const [events, setEvents] = useState([]);

  const [participants, setParticipants] =
    useState({});

  /* EVENT PAGINATION */

  const [eventPage, setEventPage] =
    useState(1);

  const eventsPerPage = 1;

  const currentUser =
    auth.currentUser;

  /* PURPOSE */
  const [
    selectedPurpose,
    setSelectedPurpose
  ] = useState("");

  /* GAME */
  const [selectedGame, setSelectedGame] =
    useState("");

  /* SUB CATEGORY */
  const [
    selectedSubCategory,
    setSelectedSubCategory
  ] = useState("");

  /* QUANTITY */
  const [quantities, setQuantities] =
    useState({});

  const navigate =
    useNavigate();

  /* LOAD PRODUCTS */
  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const snapshot =
            await getDocs(
              collection(
                db,
                "products"
              )
            );

          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data()
              })
            );

          setProducts(data);

        } catch (error) {

          console.log(error);

          alert(
            "Gagal mengambil produk"
          );

        }

      };

    fetchProducts();

  }, []);

  /* TOTAL TRANSAKSI REALTIME */
  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        doc(
          db,
          "globalTransactions",
          "stats"
        ),

        (snapshot) => {

          if (snapshot.exists()) {

            setTotalTransactions(
              snapshot.data()
                .totalTransactions || 0
            );

          }

        }

      );

    return () => unsubscribe();

  }, []);

  /* VERIFIED USERS */
  useEffect(() => {

    const fetchVerifiedUsers =
      async () => {

        try {

          const snapshot =
            await getDocs(
              collection(db, "users")
            );

          const verified =
            snapshot.docs.filter(
              (doc) =>
                doc.data()
                  .emailVerified === true
            );

          setVerifiedUsers(
            verified.length
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchVerifiedUsers();

  }, []);

  /* TESTIMONIALS */
  useEffect(() => {

    const q = query(
      collection(db, "testimonials")
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data()
              })
            );

          setTestimonials(
            data.sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) -
                (a.createdAt?.seconds || 0)
            )
          );

        }
      );

    return () => unsubscribe();

  }, []);

  /* PT PT X8 EVENT */
  useEffect(() => {

    const q = query(
      collection(db, "ptptx8Events"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setEvents(data);

    });

    return () => unsubscribe();

  }, []);

  /* PT PT X8 PARTICIPANTS */

  useEffect(() => {

    const q = query(
      collection(db, "ptptx8Participants"),
      orderBy("createdAt")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const grouped = {};

      snapshot.docs.forEach((doc) => {

        const participant = {
          id: doc.id,
          ...doc.data()
        };

        if (!grouped[participant.eventId]) {
          grouped[participant.eventId] = [];
        }

        grouped[participant.eventId].push(participant);

      });

      setParticipants(grouped);

    });

    return () => unsubscribe();

  }, []);

  /* MOBILE VIEWPORT */
  useEffect(() => {

    const meta =
      document.createElement("meta");

    meta.name = "viewport";

    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };

  }, []);

  /* CHECKOUT */
  const checkout = (item) => {

    if (
      item.stockStatus === "soldout"
    ) {
      alert(
        "Produk sedang tidak tersedia"
      );
      return;
    }

    if (!currentUser) {

      alert(
        "Silakan login dulu"
      );

      navigate("/login");

      return;

    }

    navigate("/checkout", {
      state: {
        product: item,
        quantity:
          quantities[item.id] || 1
      }
    });

  };

  /* QUANTITY */
  const increaseQty = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));

  };

  const decreaseQty = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]:
        (prev[id] || 1) > 1
          ? prev[id] - 1
          : 1
    }));

  };

  /* FILTER PRODUCTS */
  const filteredProducts =
    products
      .filter((item) => {

        const gameMatch =
          selectedGame &&
          item.category ===
          selectedGame;

        const subCategoryMatch =
          selectedSubCategory &&
          item.subCategory ===
          selectedSubCategory;

        return (
          gameMatch &&
          subCategoryMatch
        );

      })

      // SORT HARGA TERMAHAL → TERMURAH
      .sort((a, b) => b.price - a.price);


  /* EVENT PAGINATION */

  const totalEventPages =
    Math.ceil(
      events.length /
      eventsPerPage
    );

  const eventStartIndex =
    (eventPage - 1) *
    eventsPerPage;

  const currentEvents =
    events.slice(
      eventStartIndex,
      eventStartIndex +
      eventsPerPage
    );

  /* TESTIMONIAL PAGINATION */

  const totalPages =
    Math.ceil(
      testimonials.length /
      testimonialsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    testimonialsPerPage;

  const currentTestimonials =
    testimonials.slice(
      startIndex,
      startIndex +
      testimonialsPerPage
    );

  /* LOGOUT */

  return (
    <div className="store">

      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <img
            src="/black-maskot.png"
            alt="Black Maskot"
            className="hero-maskot hero-maskot-left"
            draggable="false"
          />

          <div className="hero-text">

            <div className="welcome-top">

              <span></span>

              <p>
                WELCOME TO
              </p>

              <span></span>

            </div>

            <img
              src={iconstore}
              alt="FS2B STORE"
              className="hero-store-logo"
            />

            <p className="hero-desc">
              SOLUSI TERBAIK UNTUK
              BELI ITEM GAME
              FAVORITMU
            </p>

            {/* Badge Verified */}
            <div className="verified-badge">

              <div className="verified-check">
                ✓
              </div>

              <div className="verified-text">

                <span className="verified-count">
                  {verifiedUsers}+
                </span>

                <span>
                  Pengguna Terverifikasi
                </span>

              </div>

            </div>

            {/* Badge Total Transactions */}
            <div className="transaction-badge">

              <div className="transaction-icon">
                💸
              </div>

              <div className="transaction-text">

                <span className="transaction-count">
                  {totalTransactions}+
                </span>

                <span>
                  Total Transaksi
                </span>

              </div>

            </div>

          </div>

          <img
            src="/white-maskot.png"
            alt="White Maskot"
            className="hero-maskot hero-maskot-right"
            draggable="false"
          />

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="products-section">

        <h2>
          Produk & Layanan
        </h2>

        {/* PURPOSE */}
        <div className="game-wrapper">

          <div className="title-wrapper">
            <h3 className="category-title">
              Pilih Keperluan
            </h3>
          </div>

          <div className="category-filter">

            <button
              onClick={() => {

                setSelectedPurpose(
                  "STORE"
                );

                setSelectedGame("");

                setSelectedSubCategory("");

              }}
            >
              Beli Item Game
            </button>

            <button
              onClick={() =>
                navigate("/rekber")
              }
            >
              Rekber
            </button>

          </div>

        </div>

        {/* GAME */}
        {selectedPurpose ===
          "STORE" && (

            <div className="game-wrapper">

              <div className="title-wrapper">
                <h3 className="category-title">
                  Pilih Game
                </h3>
              </div>

              <div className="category-filter">

                <button
                  onClick={() => {

                    setSelectedGame(
                      "FISH IT (Roblox)"
                    );

                    setSelectedSubCategory(
                      ""
                    );

                  }}
                >
                  FISH IT (Roblox)
                </button>

              </div>

            </div>

          )}

        {/* SUB CATEGORY */}
        {selectedGame ===
          "FISH IT (Roblox)" && (

            <div className="game-wrapper">

              <div className="title-wrapper">
                <h3 className="category-title">
                  Pilih Kategori Item
                </h3>
              </div>

              <div className="category-filter">

                <button
                  onClick={() =>
                    setSelectedSubCategory(
                      "Skin Rod"
                    )
                  }
                >
                  Skin Rod
                </button>

                <button
                  onClick={() =>
                    setSelectedSubCategory(
                      "Stuff"
                    )
                  }
                >
                  Stuff
                </button>

                <button
                  onClick={() =>
                    setSelectedSubCategory(
                      "Pet"
                    )
                  }
                >
                  Pet
                </button>

                <button
                  onClick={() =>
                    setSelectedSubCategory(
                      "Jasa Joki"
                    )
                  }
                >
                  Jasa Joki
                </button>

                <button
                  onClick={() =>
                    setSelectedSubCategory(
                      "PT PT X8"
                    )
                  }
                >
                  PT PT X8
                </button>

              </div>

            </div>

          )}

        {/* PRODUCT LIST */}
        <div
          className={
            selectedSubCategory === "PT PT X8"
              ? "product-grid event-grid"
              : "product-grid"
          }
        >

          {!selectedSubCategory ? (

            <div className="empty-products">
              Pilih kategori item terlebih dahulu
            </div>

          ) : selectedSubCategory === "PT PT X8" ? (

            <>
              {currentEvents.map((event) => {

                const eventParticipants =
                  participants[event.id] || [];

                const participantCount =
                  eventParticipants.length + 1; // +1 untuk Host

                return (

                  <div
                    className="ptx8-event-card"
                    key={event.id}
                  >

                    {/* HEADER */}

                    <div className="ptx8-header">

                      <h2>
                        🎣 {event.title}
                      </h2>

                      <span
                        className={
                          event.registrationOpen
                            ? "event-open"
                            : "event-close"
                        }
                      >
                        {event.registrationOpen
                          ? "🟢 REGISTRATION OPEN"
                          : "🔴 REGISTRATION CLOSED"}
                      </span>

                    </div>

                    <div className="ptx8-divider"></div>

                    {/* STATUS */}

                    <div className="ptx8-status-banner">

                      <span className="status-dot"></span>

                      <span>

                        {event.registrationOpen
                          ? "REGISTRATION OPEN"
                          : "REGISTRATION CLOSED"}

                      </span>

                    </div>

                    {/* INFO */}

                    <div className="ptx8-info-grid">

                      <div className="ptx8-info-card">

                        <span>📅 Jadwal Event</span>

                        <strong>
                          {event.eventDate}
                        </strong>

                      </div>

                      <div className="ptx8-info-card">

                        <span>🕗 Jam Mulai</span>

                        <strong>
                          {event.startTime}
                        </strong>

                      </div>

                      <div className="ptx8-info-card">

                        <span>👥 Slot Peserta</span>

                        <strong>

                          {participantCount}

                          {" / "}

                          {event.maxParticipants}

                        </strong>

                      </div>

                      <div className="ptx8-info-card">

                        <span>👑 Host</span>

                        <strong>

                          {event.host}

                        </strong>

                      </div>

                    </div>

                    <div className="ptx8-divider"></div>

                    {/* DAFTAR PESERTA */}

                    <div className="ptx8-participant-box">

                      <h3>
                        📋 DAFTAR PESERTA
                      </h3>

                      {[...Array(event.maxParticipants)].map((_, index) => {

                        // Slot pertama = Host
                        if (index === 0) {
                          return (
                            <div
                              className="participant-row host-row"
                              key={index}
                            >
                              <span>01.</span>

                              <span className="host-name">
                                👑 {event.host} (HOST)
                              </span>
                            </div>
                          );
                        }

                        // Peserta mulai dari slot kedua
                        const player = eventParticipants[index - 1];

                        return (

                          <div
                            className="participant-row"
                            key={index}
                          >

                            <span>
                              {(index + 1)
                                .toString()
                                .padStart(2, "0")}.
                            </span>

                            {player ? (

                              <>
                                <span>✅</span>
                                <span>{player.username}</span>
                              </>

                            ) : (

                              <>
                                <span>⬜</span>
                                <span>Slot Tersedia</span>
                              </>

                            )}

                          </div>

                        );

                      })}

                    </div>

                    <div className="ptx8-divider"></div>

                    {/* PROGRESS */}

                    <h3 className="progress-title">

                      📊 Progress Pendaftaran

                    </h3>

                    <div className="progress-bar">

                      <div

                        className="progress-fill"

                        style={{
                          width: `${Math.min(
                            (participantCount /
                              (event.maxParticipants || 20)) * 100,
                            100
                          )}%`
                        }}

                      />

                    </div>

                    <p className="progress-text">

                      {Math.round(
                        (
                          participantCount /
                          (event.maxParticipants || 20)
                        ) * 100
                      )}

                      %

                      {" • "}

                      {participantCount}

                      {" dari "}

                      {event.maxParticipants}

                      {" Slot Terisi"}

                    </p>

                    <div className="ptx8-divider"></div>

                    {/* DETAIL EVENT */}

                    <div className="ptx8-detail-grid">

                      <div>

                        💰 Harga

                        <strong>

                          Rp{" "}

                          {Number(

                            event.price || 0

                          ).toLocaleString("id-ID")}

                        </strong>

                      </div>

                      <div>

                        📌 Status

                        <strong>

                          {event.status}

                        </strong>

                      </div>

                      <div>

                        👥 Total Slot

                        <strong>

                          1 Host + {event.maxParticipants - 1} Peserta

                        </strong>

                      </div>

                    </div>

                    <div className="ptx8-divider"></div>

                    {/* BUTTON */}

                    <button
                      className="ptx8-register-btn"
                      disabled={
                        !event.registrationOpen ||
                        participantCount >= event.maxParticipants
                      }
                      onClick={() =>
                        navigate("/checkout-ptptx8", {
                          state: { event }
                        })
                      }
                    >
                      {
                        !event.registrationOpen
                          ? "🔒 PENDAFTARAN DITUTUP"
                          : participantCount >= event.maxParticipants
                            ? "🔴 SLOT PENUH"
                            : "🟢 DAFTAR SEKARANG"
                      }
                    </button>

                    <div className="ptx8-divider"></div>

                    {/* INFORMASI */}

                    <div className="ptx8-notice">

                      <h3>

                        ⚠ INFORMASI

                      </h3>

                      <ul>

                        <li>

                          Nama peserta akan muncul setelah pembayaran dikonfirmasi Admin.

                        </li>

                        <li>

                          Setelah di konfirmasi Admin, Peserta harap add usn Host di Roblox

                        </li>

                        <li>

                          Harap hadir 10 menit sebelum event dimulai.

                        </li>

                        <li>

                          Pendaftaran otomatis ditutup apabila seluruh slot telah terisi.

                        </li>

                      </ul>

                    </div>

                  </div>

                );

              })}

              {totalEventPages > 1 && (

                <div className="pagination-footer">

                  <div className="pagination">

                    <button
                      className="arrow-btn"
                      disabled={eventPage === 1}
                      onClick={() =>
                        setEventPage(eventPage - 1)
                      }
                    >
                      ‹
                    </button>

                    {[...Array(totalEventPages)].map(
                      (_, index) => (

                        <button
                          key={index}
                          className={
                            eventPage === index + 1
                              ? "active-page"
                              : ""
                          }
                          onClick={() =>
                            setEventPage(index + 1)
                          }
                        >
                          {index + 1}
                        </button>

                      )
                    )}

                    <button
                      className="arrow-btn"
                      disabled={eventPage === totalEventPages}
                      onClick={() =>
                        setEventPage(eventPage + 1)
                      }
                    >
                      ›
                    </button>

                  </div>

                </div>

              )}

            </>

          ) : filteredProducts.length === 0 ? (

            <div className="empty-products">
              Belum ada item
            </div>

          ) : (

            filteredProducts.map(
              (item) => (

                <div
                  className="card"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    draggable="false"
                  />

                  <h3>
                    {item.name}
                  </h3>

                  <div
                    className={`stock-badge ${item.stockStatus === "soldout"
                      ? "soldout"
                      : "available"
                      }`}
                  >
                    {item.stockStatus === "soldout"
                      ? "Sold Out"
                      : "Tersedia"}
                  </div>

                  <p>
                    {item.subCategory}
                  </p>

                  <p>
                    {formatPrice(
                      item.price
                    )}
                  </p>

                  {/* QUANTITY */}
                  <div className="qty-box">

                    <button
                      className="qty-btn"
                      disabled={
                        item.stockStatus === "soldout"
                      }
                      onClick={() =>
                        decreaseQty(item.id)
                      }
                    >
                      -
                    </button>

                    <span className="qty-number">
                      {quantities[item.id] || 1}
                    </span>

                    <button
                      className="qty-btn"
                      disabled={
                        item.stockStatus === "soldout"
                      }
                      onClick={() =>
                        increaseQty(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <p className="total-price">

                    Total:

                    {" "}

                    {formatPrice(
                      item.price *
                      (quantities[item.id] || 1)
                    )}

                  </p>

                  <button
                    disabled={
                      item.stockStatus === "soldout"
                    }
                    onClick={() =>
                      checkout(item)
                    }
                    className={
                      item.stockStatus === "soldout"
                        ? "checkout-disabled"
                        : ""
                    }
                  >
                    {item.stockStatus === "soldout"
                      ? "Sold Out"
                      : "Checkout"}
                  </button>

                </div>

              )
            )

          )}

        </div>

      </section>

      <section className="testimonials-section">

        <div className="testimonial-wrapper">

          <div className="testimonial-header">

            <h2>
              ⭐ Ulasan Pembeli
            </h2>

            <p className="testimonial-count">

              Menampilkan

              {" "}

              <strong>
                {testimonials.length === 0
                  ? 0
                  : startIndex + 1}
              </strong>

              -

              <strong>
                {Math.min(
                  startIndex +
                  testimonialsPerPage,
                  testimonials.length
                )}
              </strong>

              {" "}dari{" "}

              <strong>
                {testimonials.length}
              </strong>

              {" "}ulasan pelanggan terverifikasi

            </p>

          </div>

          <div className="testimonial-list">

            {currentTestimonials.map(
              (item) => (

                <div
                  key={item.id}
                  className="testimonial-item"
                >

                  <div className="testimonial-top">

                    <div className="testimonial-user">

                      <div className="testimonial-avatar">

                        {item.buyerUsername
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>

                      <div>

                        <h4>
                          {item.buyerUsername ||
                            "Anonymous"}
                        </h4>

                        <span>
                          Pembeli Terverifikasi
                        </span>

                      </div>

                    </div>

                    <div className="testimonial-rating">

                      {"★".repeat(
                        item.rating || 5
                      )}

                    </div>

                  </div>

                  <p className="testimonial-feedback">

                    "{item.feedback}"

                  </p>

                  <div className="testimonial-product-wrapper">
                    <div className="testimonial-product">
                      {item.product}
                    </div>
                  </div>

                </div>

              )
            )}

          </div>

          <div className="pagination-footer">

            <div className="pagination">

              <button
                className="arrow-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                ‹
              </button>

              {[...Array(totalPages)].map(
                (_, index) => (

                  <button
                    key={index}
                    className={
                      currentPage ===
                        index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>

                )
              )}

              <button
                className="arrow-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                ›
              </button>

            </div>

          </div>

        </div>

      </section>

      <LiveChat />

    </div>
  );
}

export default Store;