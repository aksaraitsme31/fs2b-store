import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

function Orders() {

  const [orders, setOrders] =
    useState([]);

  const navigate =
    useNavigate();

  /* PROTECT ADMIN */
  useEffect(() => {

    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    if (
      !currentUser ||
      currentUser.role !==
        "admin"
    ) {

      navigate("/");
      return;

    }

    const saved =
      JSON.parse(
        localStorage.getItem(
          "orders"
        )
      ) || [];

    /* ORDER TERBARU DI ATAS */
    const sortedOrders =
      saved.sort(
        (a, b) =>
          b.id - a.id
      );

    setOrders(sortedOrders);

  }, []);

  const processOrder = (id) => {

    const updated =
      orders.map((order) => {

        if (order.id === id) {

          /* MENUNGGU -> DIPROSES */
          if (
            order.status ===
            "Menunggu Verifikasi"
          ) {

            return {
              ...order,
              status: "Diproses"
            };

          }

          /* DIPROSES -> SELESAI */
          if (
            order.status ===
            "Diproses"
          ) {

            return {
              ...order,
              status: "Selesai"
            };

          }

        }

        return order;

      });

    setOrders(updated);

    localStorage.setItem(
      "orders",
      JSON.stringify(updated)
    );

  };

  const deleteOrder = (id) => {

    const confirmDelete =
      window.confirm(
        "Hapus pesanan ini?"
      );

    if (!confirmDelete)
      return;

    const updated =
      orders.filter(
        (order) =>
          order.id !== id
      );

    setOrders(updated);

    localStorage.setItem(
      "orders",
      JSON.stringify(updated)
    );

  };

  return (
    <div className="store">

      <nav className="navbar">

        <div className="logo">
          FS2B ORDER PANEL
        </div>

        <div className="menu">

          <a href="/admin">
            Admin
          </a>

          <a href="/">
            Store
          </a>

        </div>

      </nav>

      <section className="products-section">

        <h2>
          Daftar Pesanan
        </h2>

        <div className="product-grid">

          {orders.length === 0 ? (

            <div className="empty-products">
              Belum ada pesanan
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
                  Buyer:
                  {" "}
                  {order.username}
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
                  <strong>
                    Status:
                  </strong>
                  {" "}
                  {order.status}
                </p>

                {/* PESAN KHUSUS FISH IT */}
                {order.category ===
                  "FISH IT (Roblox)" &&
                  order.status ===
                    "Diproses" && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "14px",
                      borderRadius: "14px",
                      background:
                        "rgba(255,215,0,0.08)",
                      border:
                        "1px solid rgba(255,215,0,0.2)",
                      color: "#ffd700",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}
                  >

                    <strong>
                      Instruksi Buyer
                    </strong>

                    <br />

                    Silahkan add
                    {" "}
                    <strong>
                      @tapulimut
                    </strong>
                    {" "}
                    di Roblox.

                    <br />

                    Jika sudah,
                    langsung join ke
                    virtual server
                    untuk proses
                    pengiriman item.

                  </div>

                )}

                <h4
                  style={{
                    marginTop: "15px"
                  }}
                >
                  Bukti Transfer
                </h4>

                <img
                  src={order.proof}
                  alt="Bukti Transfer"
                  style={{
                    width: "100%",
                    borderRadius:
                      "12px",
                    marginTop: "10px"
                  }}
                />

                {order.status !==
                  "Selesai" && (

                  <button
                    onClick={() =>
                      processOrder(
                        order.id
                      )
                    }
                    style={{
                      marginTop:
                        "15px"
                    }}
                  >
                    Update Status
                  </button>

                )}

                <button
                  onClick={() =>
                    deleteOrder(
                      order.id
                    )
                  }
                  style={{
                    marginTop: "10px",
                    background:
                      "linear-gradient(135deg,#ff4d4d,#b91c1c)",
                    color: "white"
                  }}
                >
                  Hapus Order
                </button>

              </div>

            ))

          )}

        </div>

      </section>

    </div>
  );
}

export default Orders;