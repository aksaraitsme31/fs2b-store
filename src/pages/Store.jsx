import LiveChat from "../components/LiveChat";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

function Store() {
  const [products, setProducts] =
    useState([]);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [selectedGame, setSelectedGame] =
    useState("");

  const [
    selectedSubCategory,
    setSelectedSubCategory
  ] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts =
      JSON.parse(
        localStorage.getItem("products")
      ) || [];

    const user =
      JSON.parse(
        localStorage.getItem("currentUser")
      ) || null;

    setProducts(savedProducts);
    setCurrentUser(user);

    /* FIX MOBILE VIEWPORT */
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

  const checkout = (item) => {
    if (!currentUser) {
      alert("Silakan login dulu");

      navigate("/login");

      return;
    }

    navigate("/checkout", {
      state: { product: item }
    });
  };

  const filteredProducts =
    products.filter((item) => {
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
    });

  const logout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    navigate("/");

    window.location.reload();
  };

  return (
    <div className="store">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          FS2B STORE
        </div>

        <div className="menu">

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </button>

          {/* RIWAYAT KHUSUS USER */}
          {currentUser?.role !==
            "admin" && (
            <button
              onClick={() =>
                navigate("/my-orders")
              }
            >
              Riwayat
            </button>
          )}

          {/* KHUSUS ADMIN */}
          {currentUser?.role ===
            "admin" && (
            <>
              <button
                onClick={() =>
                  navigate("/admin")
                }
              >
                Admin Panel
              </button>

              <button
                onClick={() =>
                  navigate("/orders")
                }
              >
                Semua Orders
              </button>
            </>
          )}

          {currentUser ? (
            <div className="profile-dropdown">

              <button className="profile-btn">
                👤{" "}
                {currentUser.username ||
                  currentUser.name ||
                  "Buyer"}{" "}
                ▼
              </button>

              <div className="dropdown-content">

                <button
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  Profile
                </button>

                {/* RIWAYAT KHUSUS USER */}
                {currentUser.role !==
                  "admin" && (
                  <button
                    onClick={() =>
                      navigate(
                        "/my-orders"
                      )
                    }
                  >
                    Riwayat
                  </button>
                )}

                {/* MENU ADMIN */}
                {currentUser.role ===
                  "admin" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(
                          "/admin"
                        )
                      }
                    >
                      Admin Panel
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          "/orders"
                        )
                      }
                    >
                      Kelola Orders
                    </button>
                  </>
                )}

                <button
                  onClick={logout}
                >
                  Logout
                </button>

              </div>

            </div>
          ) : (
            <>
              <button
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
              >
                Register
              </button>
            </>
          )}

        </div>

      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          {/* MASKOT KIRI */}
          <img
            src="/black-maskot.png"
            alt="Black Maskot"
            className="hero-maskot hero-maskot-left"
            draggable="false"
          />

          {/* HERO TEXT */}
          <div className="hero-text">

            <div className="welcome-top">

              <span></span>

              <p>
                WELCOME TO
              </p>

              <span></span>

            </div>

            <h1 className="hero-title">
              FS2B
            </h1>

            <h2 className="hero-subtitle">
              STORE
            </h2>

            <p className="hero-desc">
              SOLUSI TERBAIK UNTUK
              BELI ITEM GAME
              FAVORITMU
            </p>

            {/* FEATURES */}
            <div className="hero-features">

              <div className="feature-box">

                <div className="feature-icon">
                  ⚡
                </div>

                <div className="feature-text">

                  <h4>
                    PROSES CEPAT
                  </h4>

                  <p>
                    Anti drama
                  </p>

                </div>

              </div>

              <div className="feature-box">

                <div className="feature-icon">
                  🛡️
                </div>

                <div className="feature-text">

                  <h4>
                    AMAN &
                    TERPERCAYA
                  </h4>

                  <p>
                    100% aman anti
                    scam
                  </p>

                </div>

              </div>

              <div className="feature-box">

                <div className="feature-icon">
                  🎧
                </div>

                <div className="feature-text">

                  <h4>
                    24/7 SUPPORT
                  </h4>

                  <p>
                    Siap membantu
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* MASKOT KANAN */}
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
          Produk Tersedia
        </h2>

        {/* GAME */}
        <div className="game-wrapper">

          <h3 className="category-title">
            Pilih Game
          </h3>

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

        {/* SUB CATEGORY */}
        {selectedGame ===
          "FISH IT (Roblox)" && (
          <div className="game-wrapper">

            <h3 className="category-title">
              Pilih Kategori Item
            </h3>

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
                    "Jasa Joki"
                  )
                }
              >
                Jasa Joki
              </button>

            </div>

          </div>
        )}

        {/* PRODUCT LIST */}
        <div className="product-grid">

          {!selectedSubCategory ? (
            <div className="empty-products">
              Pilih kategori item
              terlebih dahulu
            </div>
          ) : filteredProducts.length ===
            0 ? (
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

                  <p>
                    {
                      item.subCategory
                    }
                  </p>

                  <p>
                    {formatPrice(
                      item.price
                    )}
                  </p>

                  <button
                    onClick={() =>
                      checkout(
                        item
                      )
                    }
                  >
                    Checkout
                  </button>

                </div>
              )
            )
          )}

        </div>

      </section>

      {/* FOOTER */}
      <footer>
        © 2026 FS2B STORE
      </footer>

      <LiveChat />

    </div>
  );
}

export default Store;