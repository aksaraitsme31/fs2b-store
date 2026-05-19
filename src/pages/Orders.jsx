import Navbar from "../components/Navbar";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

function Orders() {

  const [orders, setOrders] =
    useState([]);

  const [previewImage, setPreviewImage] =
    useState(null);

  const navigate =
    useNavigate();

  const currentUser =
    auth.currentUser;

  /* ONLY OWNER ADMIN */
  useEffect(() => {

    if (
      !currentUser ||
      currentUser.email !==
      "thirtyone.zerozero@gmail.com"
    ) {

      navigate("/");

      return;

    }

    const unsubscribe =
      onSnapshot(
        collection(db, "orders"),
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data()
              })
            );

          /* ORDER TERBARU DI ATAS */
          data.sort((a, b) => {

            const timeA =
              a.createdAt?.seconds || 0;

            const timeB =
              b.createdAt?.seconds || 0;

            return timeB - timeA;

          });

          setOrders(data);

        },
        (error) => {

          console.log(error);

          alert(
            "Gagal mengambil orders"
          );

        }
      );

    return () => unsubscribe();

  }, []);

  /* UPDATE STATUS */
  const processOrder =
    async (id, status) => {

      let newStatus =
        status;

      if (
        status ===
        "Menunggu Verifikasi"
      ) {

        newStatus =
          "Diproses";

      } else if (
        status ===
        "Diproses"
      ) {

        newStatus =
          "Selesai";

      }

      try {

        await updateDoc(
          doc(
            db,
            "orders",
            id
          ),
          {
            status: newStatus
          }
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal update status"
        );

      }

    };

  /* DELETE ORDER */
  const deleteOrder =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Hapus pesanan ini?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "orders",
            id
          )
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal menghapus order"
        );

      }

    };

  return (

    <div className="store">

      <Navbar />

      {/* CONTENT */}
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
                  Harga Satuan:
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
                  <strong>
                    Total:
                  </strong>
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
                  Buyer:
                  {" "}
                  {order.username}
                </p>

                <p>
                  Email:
                  {" "}
                  {order.email}
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

                {/* PESAN KHUSUS */}
                {order.category ===
                  "FISH IT (Roblox)" &&
                  order.status ===
                  "Diproses" && (

                    <div
                      style={{
                        marginTop:
                          "15px",
                        padding: "14px",
                        borderRadius:
                          "14px",
                        background:
                          "rgba(255,215,0,0.08)",
                        border:
                          "1px solid rgba(255,215,0,0.2)",
                        color:
                          "#ffd700",
                        fontSize:
                          "14px",
                        lineHeight:
                          "1.6"
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
                    marginTop:
                      "15px"
                  }}
                >
                  Bukti Transfer
                </h4>

                <img
                  src={order.proof}
                  alt="Bukti Transfer"
                  onClick={() =>
                    setPreviewImage(order.proof)
                  }
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginTop: "10px",
                    cursor: "pointer"
                  }}
                />

                {order.status !==
                  "Selesai" && (

                    <button
                      onClick={() =>
                        processOrder(
                          order.id,
                          order.status
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
                    marginTop:
                      "10px",
                    background:
                      "linear-gradient(135deg,#ff4d4d,#b91c1c)",
                    color:
                      "white"
                  }}
                >
                  Hapus Order
                </button>

              </div>

            ))

          )}

        </div>

      </section>

      {previewImage && (

        <div
          onClick={() =>
            setPreviewImage(null)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "10px",
            overflow: "auto"
          }}
        >

          <img
            src={previewImage}
            alt="fullscreen"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain",
              borderRadius: "16px"
            }}
          />

        </div>

      )}

    </div>
  );
}

export default Orders;