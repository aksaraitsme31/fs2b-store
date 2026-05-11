import { useEffect, useState } from "react";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    selectedOrder,
    setSelectedOrder
  ] = useState(null);

  useEffect(() => {

    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    if (!currentUser)
      return;

    const saved =
      JSON.parse(
        localStorage.getItem(
          "orders"
        )
      ) || [];

    const userOrders =
      saved.filter(
        (order) =>
          order.username ===
          currentUser.username
      );

    /* ORDER TERBARU DI ATAS */
    setOrders(
      userOrders.reverse()
    );

  }, []);

  return (
    <div className="store">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          FS2B RIWAYAT
        </div>

        <div className="menu">

          <a href="/">
            Home
          </a>

          <a href="/profile">
            Profile
          </a>

        </div>

      </nav>

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

            orders.map((order) => (

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

                <p>
                  Rp{" "}
                  {Number(
                    order.price
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
                    className={`status-text ${
                      order.status ===
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

            ))

          )}

        </div>

      </section>

      {/* MODAL DETAIL */}
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
                Harga:
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

            {/* PESAN KHUSUS FISH IT */}
            {selectedOrder.status ===
              "Diproses" &&
              selectedOrder.category ===
                "FISH IT (Roblox)" && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  borderRadius: "14px",
                  background:
                    "rgba(255,215,0,0.08)",
                  border:
                    "1px solid rgba(255,215,0,0.2)",
                  textAlign: "left",
                  lineHeight: "1.7"
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
                    marginTop: "8px"
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
                marginTop: "20px"
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
                marginTop: "20px"
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