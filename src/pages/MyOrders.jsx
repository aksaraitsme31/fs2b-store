import Navbar from "../components/Navbar";

import { FiCopy } from "react-icons/fi";

import toast from "react-hot-toast";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  increment,
  getDoc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

import {
  onAuthStateChanged
} from "firebase/auth";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    selectedOrder,
    setSelectedOrder
  ] = useState(null);

  const [rating, setRating] =
    useState(0);

  const [feedback, setFeedback] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const submitFeedback =
    async () => {

      if (submitting) return;

      setSubmitting(true);

      if (!selectedOrder) {
        setSubmitting(false);
        return;
      }

      if (rating === 0) {
        toast("Pilih rating terlebih dahulu ⭐");
        return;
      }

      try {

        const orderRef = doc(
          db,
          "orders",
          selectedOrder.id
        );

        const latestOrder =
          await getDoc(orderRef);

        if (!latestOrder.exists()) {
          toast.error("Order tidak ditemukan");
          return;
        }

        const orderData =
          latestOrder.data();

        // sudah pernah feedback
        if (orderData.feedbackSubmitted) {
          toast.error(
            "Feedback sudah pernah dikirim"
          );
          return;
        }

        // simpan testimonial
        await addDoc(
          collection(db, "testimonials"),
          {
            buyerUid:
              orderData.buyerUid,

            buyerUsername:
              orderData.buyerUsername,

            product:
              orderData.product,

            rating,

            feedback,

            createdAt:
              serverTimestamp()
          }
        );

        // update order DULU
        await updateDoc(
          orderRef,
          {
            rating,
            feedback,
            feedbackSubmitted: true,
            coinRewarded: true
          }
        );

        const rewardCoin =
          orderData.rewardCoin || 0;

        // tambah saldo coin
        await updateDoc(
          doc(
            db,
            "users",
            orderData.buyerUid
          ),
          {
            coin: increment(
              rewardCoin
            )
          }
        );

        // simpan riwayat coin
        await addDoc(
          collection(
            db,
            "users",
            orderData.buyerUid,
            "coinHistory"
          ),
          {
            type: "feedback_reward",

            amount: rewardCoin,

            description:
              "Reward Feedback",

            orderId:
              selectedOrder.id,

            product:
              orderData.product,

            createdAt:
              serverTimestamp()
          }
        );

        toast.success(
          `Feedback berhasil dikirim ❤️ +${orderData.rewardCoin || 0} Coin`
        );

        setSelectedOrder({
          ...selectedOrder,
          rating,
          feedback,
          feedbackSubmitted: true,
          coinRewarded: true
        });

        setRating(0);
        setFeedback("");

      } catch (error) {

        console.log(error);

        toast.error(
          "Gagal mengirim feedback 😔💔"
        );

      } finally {

        setSubmitting(false);

      }

    };

  /* LOAD USER ORDERS REALTIME */
  useEffect(() => {

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (!currentUser) {

            setOrders([]);

            return;

          }

          const q = query(
            collection(db, "orders"),
            where(
              "buyerUid",
              "==",
              currentUser.uid
            )
          );

          const unsubscribeOrders =
            onSnapshot(
              q,
              (snapshot) => {

                const userOrders =
                  snapshot.docs.map(
                    (item) => ({
                      id: item.id,
                      ...item.data()
                    })
                  );

                userOrders.sort(
                  (a, b) => {

                    const timeA =
                      a.createdAt?.seconds || 0;

                    const timeB =
                      b.createdAt?.seconds || 0;

                    return timeB - timeA;

                  }
                );

                setOrders(
                  userOrders
                );

              },
              (error) => {

                console.log(error);

              }
            );

        }
      );

    return () =>
      unsubscribeAuth();

  }, []);

  return (

    <div className="store">

      <Navbar />

      {/* CONTENT */}
      <section className="products-section">

        <h2>
          Histori Transaksi Saya
        </h2>

        <div className="product-grid">

          {orders.length === 0 ? (

            <div className="empty-products">
              Belum ada transaksi
            </div>

          ) : (

            orders.map(
              (order) => (

                <div
                  className="card"
                  key={order.id}
                >

                  <img
                    src={order.image}
                    alt={order.product}
                  />

                  <h3>
                    {order.product}
                  </h3>

                  <div className="order-info-box">

                    <div className="order-info-row">
                      <span className="label">
                        ID Transaksi
                      </span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >

                        <span className="value">
                          {order.transactionId}
                        </span>

                        <button
                          className="copy-btn"
                          onClick={async () => {

                            try {

                              await navigator.clipboard.writeText(
                                order.transactionId
                              );

                              toast.success(
                                "ID transaksi berhasil disalin 😉"
                              );

                            } catch {

                              toast.error(
                                "Gagal menyalin ID 😔"
                              );

                            }

                          }}
                        >
                          <FiCopy />
                        </button>

                      </div>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Harga
                      </span>

                      <span className="value">
                        Rp {Number(order.price).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Jumlah
                      </span>

                      <span className="value">
                        {order.quantity || 1}
                      </span>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Total
                      </span>

                      <span className="value">
                        Rp {Number(
                          order.totalPrice ||
                          order.price * (order.quantity || 1)
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Username Game
                      </span>

                      <span className="value">
                        {order.gameUsername}
                      </span>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Tanggal
                      </span>

                      <span className="value">
                        {order.date}
                      </span>
                    </div>

                    <div className="order-info-row">
                      <span className="label">
                        Status
                      </span>

                      <span
                        className={`value status-value ${order.status === "Selesai"
                          ? "success"
                          : order.status === "Diproses"
                            ? "process"
                            : "pending"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>

                  </div>

                  <button
                    onClick={() => {

                      setSelectedOrder(
                        order
                      );

                      setRating(
                        order.rating || 0
                      );

                      setFeedback(
                        order.feedback || ""
                      );

                    }}
                  >
                    Lihat Detail
                  </button>

                </div>

              )
            )

          )}

        </div>

      </section>

      {/* MODAL */}
      {selectedOrder && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h2>
              Detail Transaksi
            </h2>

            <img
              src={
                selectedOrder.image
              }
              alt={
                selectedOrder.product
              }
              className="modal-product-image"
            />

            <p>

              <strong>
                Item:
              </strong>

              {" "}

              {
                selectedOrder.product
              }

            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}
            >

              <strong>
                ID Transaksi:
              </strong>

              <span>

                {
                  selectedOrder.transactionId
                }

              </span>

              <button
                className="copy-btn"
                onClick={async () => {

                  try {

                    console.log(
                      "ID:",
                      selectedOrder.transactionId
                    );

                    await navigator.clipboard.writeText(
                      selectedOrder.transactionId
                    );

                    toast.success(
                      "ID transaksi berhasil disalin 😉"
                    );

                  } catch (error) {

                    console.log(error);

                    toast.error(
                      "Gagal menyalin ID 😔"
                    );

                  }

                }}
              >

                <FiCopy />

              </button>

            </div>

            <p>

              <strong>
                Harga Satuan:
              </strong>

              {" "}

              Rp{" "}

              {Number(
                selectedOrder.price
              ).toLocaleString(
                "id-ID"
              )}

            </p>

            <p>

              <strong>
                Jumlah:
              </strong>

              {" "}

              {selectedOrder.quantity || 1}

            </p>

            <p>

              <strong>
                Total:
              </strong>

              {" "}

              Rp{" "}

              {Number(
                selectedOrder.totalPrice ||
                (
                  selectedOrder.price *
                  (selectedOrder.quantity || 1)
                )
              ).toLocaleString(
                "id-ID"
              )}

            </p>

            <p>

              <strong>
                Username Game:
              </strong>

              {" "}

              {
                selectedOrder.gameUsername
              }

            </p>

            <p>

              <strong>
                Tanggal:
              </strong>

              {" "}

              {
                selectedOrder.date
              }

            </p>

            <p>

              <strong>
                Status:
              </strong>

              {" "}

              {
                selectedOrder.status
              }

            </p>

            {
              selectedOrder.status ===
              "Selesai" &&
              !selectedOrder.feedbackSubmitted && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "1px solid #374151"
                  }}
                >

                  <h3>
                    Beri Rating
                  </h3>

                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "10px"
                    }}
                  >

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <span
                          key={star}
                          onClick={() =>
                            setRating(star)
                          }
                          style={{
                            cursor: "pointer",
                            color:
                              star <= rating
                                ? "#FFD700"
                                : "#6b7280",
                            textShadow:
                              star <= rating
                                ? "0 0 10px rgba(255,215,0,0.8)"
                                : "none",
                            transition:
                              "all .2s ease"
                          }}
                        >
                          ★
                        </span>

                      )
                    )}

                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) =>
                      setFeedback(
                        e.target.value
                      )
                    }
                    placeholder="Tulis feedback..."
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      borderRadius: "10px",
                      padding: "10px"
                    }}
                  />

                  <button
                    disabled={submitting}
                    onClick={submitFeedback}
                    style={{
                      marginTop: "10px",
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting
                        ? "not-allowed"
                        : "pointer"
                    }}
                  >
                    {submitting
                      ? "Mengirim..."
                      : "Kirim Feedback"}
                  </button>

                </div>

              )
            }

            {
              selectedOrder.feedbackSubmitted && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "1px solid #374151"
                  }}
                >

                  <h3>
                    Feedback Anda
                  </h3>

                  <p>

                    {"★".repeat(
                      selectedOrder.rating
                    )}

                  </p>

                  <p>

                    {
                      selectedOrder.feedback
                    }

                  </p>

                </div>

              )
            }

            {/* PESAN KHUSUS */}
            {selectedOrder.status ===
              "Diproses" &&
              selectedOrder.category ===
              "FISH IT (Roblox)" && (

                <div
                  style={{
                    marginTop:
                      "15px",
                    padding:
                      "15px",
                    borderRadius:
                      "14px",
                    background:
                      "rgba(255,215,0,0.08)",
                    border:
                      "1px solid rgba(255,215,0,0.2)",
                    textAlign:
                      "left",
                    lineHeight:
                      "1.7"
                  }}
                >

                  <p>

                    ⚡ Silahkan add
                    {" "}
                    <strong>
                      @tapulimut
                    </strong>
                    {" "}
                    di Roblox

                  </p>

                  <p
                    style={{
                      marginTop:
                        "8px"
                    }}
                  >

                    🎮 Jika sudah,
                    langsung join ke
                    virtual server
                    untuk proses
                    pengiriman item

                  </p>

                </div>

              )}

            <h3
              style={{
                marginTop:
                  "20px"
              }}
            >
              Bukti Transfer
            </h3>

            <img
              src={
                selectedOrder.proof
              }
              alt="Proof"
              className="modal-proof-image"
            />

            <button
              onClick={() =>
                setSelectedOrder(
                  null
                )
              }
              style={{
                marginTop:
                  "20px"
              }}
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyOrders;