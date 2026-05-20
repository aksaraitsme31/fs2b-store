import Navbar from "../components/Navbar";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    selectedOrder,
    setSelectedOrder
  ] = useState(null);

  /* LOAD USER ORDERS REALTIME */
  useEffect(() => {

    const currentUser =
      auth.currentUser;

    if (!currentUser)
      return;

    const q = query(
      collection(db, "orders"),
      where(
        "email",
        "==",
        currentUser.email
      )
    );

    const unsubscribe =
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

          /* TERBARU DI ATAS */
          userOrders.sort((a, b) => {

            const timeA =
              a.createdAt?.seconds || 0;

            const timeB =
              b.createdAt?.seconds || 0;

            return timeB - timeA;

          });

          setOrders(userOrders);

        },
        (error) => {

          console.log(error);

          alert(
            "Gagal mengambil transaksi"
          );

        }
      );

    return () => unsubscribe();

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

                  <p
                    style={{
                      color: "#ffd700",
                      fontWeight: "700",
                      marginTop: "5px"
                    }}
                  >
                    ID:
                    {" "}
                    {order.transactionId}
                  </p>

                  <p>

                    Harga:
                    {" "}

                    Rp{" "}

                    {Number(
                      order.price
                    ).toLocaleString(
                      "id-ID"
                    )}

                  </p>

                  <p>

                    Jumlah:
                    {" "}

                    {order.quantity || 1}

                  </p>

                  <p>

                    Total:
                    {" "}

                    Rp{" "}

                    {Number(
                      order.totalPrice ||
                      (
                        order.price *
                        (order.quantity || 1)
                      )
                    ).toLocaleString(
                      "id-ID"
                    )}

                  </p>

                  <p>

                    Username Game:
                    {" "}

                    {
                      order.gameUsername
                    }

                  </p>

                  <p>

                    Tanggal:
                    {" "}

                    {order.date}

                  </p>

                  <p>

                    Status:
                    {" "}

                    <span
                      className={`status-text ${order.status ===
                        "Selesai"
                        ? "success"
                        : order.status ===
                          "Diproses"
                          ? "process"
                          : "pending"
                        }`}
                    >

                      {order.status}

                    </span>

                  </p>

                  <button
                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }
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

            <p>

              <strong>
                ID Transaksi:
              </strong>

              {" "}

              {
                selectedOrder.transactionId
              }

            </p>

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