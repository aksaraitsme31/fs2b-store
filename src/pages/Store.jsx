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
  getDocs
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

function Store() {

  const [products, setProducts] =
    useState([]);

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
                    onClick={() =>
                      checkout(item)
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

      <LiveChat />

    </div>
  );
}

export default Store;