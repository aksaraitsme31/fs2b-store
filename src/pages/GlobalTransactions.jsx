import Navbar from "../components/Navbar";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

import {
  db
} from "../firebase/firebase";

import {
  ShoppingBag,
  ShieldCheck,
  Sparkles
} from "lucide-react";

function GlobalTransactions() {

  const [storeTransactions, setStoreTransactions] =
    useState([]);

  const [rekberTransactions, setRekberTransactions] =
    useState([]);

  /* =====================================================
     REALTIME GLOBAL TRANSACTIONS
  ===================================================== */
  useEffect(() => {

    const q =
      query(
        collection(db, "globalTransactions"),
        orderBy("createdAt", "desc"),
        limit(20)
      );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

        /* =====================================================
           ORDER ITEM
        ===================================================== */
        const storeData =
          data
            .filter(
              (item) =>
                item.source === "store"
            )
            .slice(0, 3);

        /* =====================================================
           ORDER REKBER
        ===================================================== */
        const rekberData =
          data
            .filter(
              (item) =>
                item.source === "rekber"
            )
            .slice(0, 3);

        setStoreTransactions(storeData);

        setRekberTransactions(rekberData);

      });

    return () => unsubscribe();

  }, []);

  /* =====================================================
     FORMAT DATE
  ===================================================== */
  const formatDate = (timestamp) => {

    if (!timestamp?.seconds)
      return "-";

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleDateString("id-ID");

  };

  /* =====================================================
     FORMAT TIME
  ===================================================== */
  const formatTime = (timestamp) => {

    if (!timestamp?.seconds)
      return "-";

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleTimeString("id-ID");

  };

  /* =====================================================
     SENSOR TRANSACTION ID
  ===================================================== */
  const hiddenTransactionId =
    (id) => {

      if (!id) return "-";

      return (
        id.slice(0, 10) +
        "****" +
        id.slice(-4)
      );

    };

  /* =====================================================
     SENSOR PRICE
  ===================================================== */
  const hiddenPrice =
    (price) => {

      if (!price) return "0";

      const str =
        String(price);

      return (
        "*".repeat(
          str.length - 4
        ) +
        str.slice(-4)
      );

    };

  return (

    <div className="store">

      <Navbar />

      <div className="global-page">

        <div className="global-container">

          {/* =====================================================
           TITLE
        ===================================================== */}
          <div className="global-heading">

            <span>
              REALTIME TRANSACTION
            </span>

            <h1>
              GLOBAL TRANSAKSI
            </h1>

            <p>
              Seluruh transaksi terbaru
              dari Order Item dan Rekber
              akan tampil otomatis secara realtime.
            </p>

          </div>

          {/* =====================================================
           ORDER ITEM
        ===================================================== */}
          <section className="global-section">

            <div className="section-header">

              <div className="section-left">

                <ShoppingBag size={34} />

                <div>

                  <h2>
                    Order Item
                  </h2>

                  <p>
                    Transaksi pembelian item game
                  </p>

                </div>

              </div>

            </div>

            <div className="transactions-grid">

              {storeTransactions.length === 0 ? (

                <div className="empty-transactions">

                  Belum ada transaksi item

                </div>

              ) : (

                storeTransactions.map(
                  (item, index) => (

                    <div
                      key={item.id}
                      className={`transaction-card ${index === 0
                          ? "newest-card"
                          : ""
                        }`}
                    >

                      {/* =====================================================
                       TOP
                    ===================================================== */}
                      <div className="transaction-top">

                        <div className="transaction-icon">

                          <Sparkles size={22} />

                        </div>

                        <span>
                          TRANSAKSI ITEM
                        </span>

                      </div>

                      {/* =====================================================
                       INFO
                    ===================================================== */}
                      <div className="transaction-info">

                        <div className="info-row">

                          <span>
                            ID TRANSAKSI
                          </span>

                          <strong>
                            {
                              hiddenTransactionId(
                                item.transactionId
                              )
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            PEMBELI
                          </span>

                          <strong>
                            {
                              item.buyerUsername
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            PRODUK
                          </span>

                          <strong>
                            {
                              item.itemName
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            TOTAL PEMBAYARAN
                          </span>

                          <strong className="price-text">

                            Rp {
                              hiddenPrice(
                                item.totalPayment
                              )
                            }

                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            DATE
                          </span>

                          <strong>
                            {
                              formatDate(
                                item.createdAt
                              )
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            TIME
                          </span>

                          <strong>
                            {
                              formatTime(
                                item.createdAt
                              )
                            }
                          </strong>

                        </div>

                      </div>

                      {/* =====================================================
                       STATUS
                    ===================================================== */}
                      <div className="transaction-status">

                        TRANSAKSI SELESAI

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

          {/* =====================================================
           ORDER REKBER
        ===================================================== */}
          <section className="global-section">

            <div className="section-header">

              <div className="section-left">

                <ShieldCheck size={34} />

                <div>

                  <h2>
                    Order Rekber
                  </h2>

                  <p>
                    Transaksi rekber buyer & seller
                  </p>

                </div>

              </div>

            </div>

            <div className="transactions-grid">

              {rekberTransactions.length === 0 ? (

                <div className="empty-transactions">

                  Belum ada transaksi rekber

                </div>

              ) : (

                rekberTransactions.map(
                  (item, index) => (

                    <div
                      key={item.id}
                      className={`transaction-card ${index === 0
                          ? "newest-card"
                          : ""
                        }`}
                    >

                      {/* =====================================================
                       TOP
                    ===================================================== */}
                      <div className="transaction-top">

                        <div className="transaction-icon">

                          <ShieldCheck size={22} />

                        </div>

                        <span>
                          TRANSAKSI REKBER
                        </span>

                      </div>

                      {/* =====================================================
                       INFO
                    ===================================================== */}
                      <div className="transaction-info">

                        <div className="info-row">

                          <span>
                            ID TRANSAKSI
                          </span>

                          <strong>
                            {
                              hiddenTransactionId(
                                item.transactionId
                              )
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            BUYER
                          </span>

                          <strong>
                            {
                              item.buyerUsername
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            SELLER
                          </span>

                          <strong>
                            {
                              item.sellerUsername
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            BARANG / JASA
                          </span>

                          <strong>
                            {
                              item.itemName
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            TOTAL PEMBAYARAN
                          </span>

                          <strong className="price-text">

                            Rp {
                              hiddenPrice(
                                item.totalPayment
                              )
                            }

                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            DATE
                          </span>

                          <strong>
                            {
                              formatDate(
                                item.createdAt
                              )
                            }
                          </strong>

                        </div>

                        <div className="info-row">

                          <span>
                            TIME
                          </span>

                          <strong>
                            {
                              formatTime(
                                item.createdAt
                              )
                            }
                          </strong>

                        </div>

                      </div>

                      {/* =====================================================
                       STATUS
                    ===================================================== */}
                      <div className="transaction-status">

                        TRANSAKSI SELESAI

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        </div>

      </div>

    </div>

  );

}

export default GlobalTransactions;