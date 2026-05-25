import Navbar from "../components/Navbar";

import {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import {
  getDatabase,
  ref,
  set,
  onDisconnect,
} from "firebase/database";

import {
  db,
  auth
} from "../firebase/firebase";

function Admin() {

  const navigate =
    useNavigate();

  const [
    firebaseUser,
    setFirebaseUser
  ] = useState(null);

  const [
    userRole,
    setUserRole
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          setFirebaseUser(user);

          if (user) {

            const userRef =
              doc(
                db,
                "users",
                user.uid
              );

            const userSnap =
              await getDoc(userRef);

            if (userSnap.exists()) {

              setUserRole(
                userSnap.data().role || ""
              );

            }

          }

          setLoading(false);

        }
      );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    if (
      !firebaseUser ||
      userRole !== "admin"
    ) return;

    const realtimeDb =
      getDatabase();

    const adminStatusRef =
      ref(
        realtimeDb,
        "status/admin"
      );

    // ADMIN ONLINE
    set(adminStatusRef, {
      online: true,
      lastSeen: Date.now(),
    });

    // AUTO OFFLINE
    onDisconnect(adminStatusRef).set({
      online: false,
      lastSeen: Date.now(),
    });

  }, [
    firebaseUser,
    userRole
  ]);

  /* =========================
     PRODUCT STATE
  ========================= */

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    subCategory,
    setSubCategory
  ] = useState("");

  const [editId, setEditId] =
    useState(null);

  /* =========================
     REKBER STATE
  ========================= */

  const [
    rekberOrders,
    setRekberOrders
  ] = useState([]);

  const [
    rekberMessages,
    setRekberMessages
  ] = useState([]);

  const [
    adminChatInputs,
    setAdminChatInputs
  ] = useState({});

  const [previewMedia, setPreviewMedia] = useState(null);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {

    const q = query(
      collection(db, "products")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

        setProducts(data);

      });

    return () => unsubscribe();

  }, []);

  /* =========================
     LOAD REKBER REALTIME
  ========================= */

  useEffect(() => {

    const q = query(
      collection(db, "rekberOrders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

        setRekberOrders(data);

      });

    return () => unsubscribe();

  }, []);

  /* =========================
     LOAD CHAT REALTIME
  ========================= */

  useEffect(() => {

    const q =
      query(
        collection(
          db,
          "rekberMessages"
        ),
        orderBy(
          "createdAt",
          "asc"
        )
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

          setRekberMessages(
            data
          );

        }
      );

    return () => unsubscribe();

  }, []);

  /* =========================
     HANDLE IMAGE
  ========================= */

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setImage(
        reader.result
      );

    };

    reader.readAsDataURL(
      file
    );

  };

  /* =========================
     EDIT PRODUCT
  ========================= */

  const editProduct = (item) => {

    setEditId(item.id);

    setName(item.name);

    setPrice(item.price);

    setImage(item.image);

    setCategory(item.category);

    setSubCategory(
      item.subCategory
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  /* =========================
     ADD / UPDATE PRODUCT
  ========================= */

  const addProduct =
    async () => {

      if (
        !name ||
        !price ||
        !image ||
        !category ||
        !subCategory
      ) {

        alert(
          "Lengkapi semua data produk"
        );

        return;

      }

      try {

        if (editId) {

          const productRef =
            doc(
              db,
              "products",
              editId
            );

          await updateDoc(
            productRef,
            {
              name,
              price,
              image,
              category,
              subCategory
            }
          );

          alert(
            "Produk berhasil diupdate"
          );

          setEditId(null);

        } else {

          await addDoc(
            collection(
              db,
              "products"
            ),
            {
              name,
              price,
              image,
              category,
              subCategory
            }
          );

          alert(
            "Produk berhasil ditambahkan"
          );

        }

        setName("");
        setPrice("");
        setImage("");
        setCategory("");
        setSubCategory("");

      } catch (error) {

        console.log(error);

        alert(
          "Gagal menyimpan produk"
        );

      }

    };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Yakin ingin menghapus produk?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "products",
            id
          )
        );

        alert(
          "Produk berhasil dihapus"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal menghapus produk"
        );

      }

    };

  const copyTransactionId = async (id) => {

    try {

      await navigator.clipboard.writeText(id);

      alert("ID transaksi berhasil disalin");

    } catch (error) {

      console.log(error);

      alert("Gagal menyalin ID");

    }

  };

  /* =========================
     ADMIN Lock Chat
  ========================= */

  const toggleChatLock =
    async (id, currentState) => {

      try {

        const rekberRef =
          doc(
            db,
            "rekberOrders",
            id
          );

        await updateDoc(
          rekberRef,
          {
            chatLocked:
              !currentState
          }
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal update chat"
        );

      }

    };

  /* =========================
     ADMIN CHAT UI
  ========================= */

  const sendAdminChat =
    async (rekberId) => {

      const message =
        adminChatInputs[rekberId];

      if (!message?.trim())
        return;

      const rekberData =
        rekberOrders.find(
          (item) =>
            item.id === rekberId
        );

      if (!rekberData)
        return;

      const adminIds = [
        "STTuFyMpReO8dNpxpqF3cZQeqji2",
        "Cqvqy3v7sxSyuOYTg6qs6vr017N2"
      ];

      await addDoc(
        collection(
          db,
          "rekberMessages"
        ),
        {

          rekberId,

          buyerId:
            rekberData.buyerId,

          sellerId:
            rekberData.sellerId,

          participants: [
            rekberData.buyerId,
            rekberData.sellerId,
            ...adminIds
          ],

          senderId:
            firebaseUser.uid,

          sender: "ADMIN",

          username: "ADMIN",

          role: "ADMIN",

          message,

          createdAt:
            serverTimestamp()

        }
      );

      setAdminChatInputs({
        ...adminChatInputs,
        [rekberId]: ""
      });

    };

  const renderAdminChat =
    (rekberId) => {

      const filteredMessages =
        rekberMessages.filter(
          (msg) =>
            msg.rekberId ===
            rekberId
        );

      return (

        <>

          <div className="chat-messages">

            {filteredMessages.length === 0 ? (

              <p>
                Belum ada chat
              </p>

            ) : (

              filteredMessages.map(
                (msg) => (

                  <div
                    key={msg.id}
                    className={
                      msg.sender === "ADMIN"
                        ? "my-chat"
                        : "other-chat"
                    }
                  >

                    <strong>

                      {msg.sender === "ADMIN"
                        ? "ADMIN"

                        : msg.role
                          ? `[${msg.role}] ${msg.username || msg.sender}`

                          : msg.username || msg.sender}

                    </strong>

                    <p>
                      {msg.message}
                    </p>

                    {/* IMAGE */}
                    {msg.media &&
                      msg.mediaType === "image" && (

                        <img
                          src={msg.media}
                          alt="media"
                          onClick={() =>
                            setPreviewMedia({
                              url: msg.media,
                              type: "image"
                            })
                          }
                          style={{
                            width: "220px",
                            marginTop: "10px",
                            borderRadius: "12px",
                            cursor: "pointer"
                          }}
                        />

                      )}

                    {/* VIDEO */}
                    {msg.media &&
                      msg.mediaType === "video" && (

                        <video
                          onClick={() =>
                            setPreviewMedia({
                              url: msg.media,
                              type: "video"
                            })
                          }
                          style={{
                            width: "240px",
                            marginTop: "10px",
                            borderRadius: "12px",
                            cursor: "pointer"
                          }}
                        >
                          <source src={msg.media} />
                        </video>

                      )}

                  </div>

                )
              )

            )}

          </div>

          {previewMedia !== null && (

            <div
              onClick={() =>
                setPreviewMedia(null)
              }
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.96)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
                padding: "20px",
                pointerEvents: "auto"
              }}
            >

              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                style={{
                  display: "flex",
                  pointerEvents: "auto",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%"
                }}
              >

                {previewMedia.type === "image" ? (

                  <img
                    src={previewMedia.url}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "12px"
                    }}
                  />

                ) : (

                  <video
                    controls
                    autoPlay
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "12px"
                    }}
                  >
                    <source src={previewMedia.url} />
                  </video>

                )}

              </div>

            </div>

          )}

          <div className="chat-input-area">

            <input
              type="text"
              placeholder="Tulis pesan admin..."
              value={
                adminChatInputs[
                rekberId
                ] || ""
              }
              onChange={(e) =>
                setAdminChatInputs({
                  ...adminChatInputs,
                  [rekberId]:
                    e.target.value
                })
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendAdminChat(
                    rekberId
                  );

                }

              }}
            />

            <button
              onClick={() =>
                sendAdminChat(
                  rekberId
                )
              }
            >
              Kirim
            </button>

          </div>

        </>

      );

    };

  if (loading) {

    return (

      <div className="auth-page">

        <div className="auth-box">

          <h1>
            Loading...
          </h1>

        </div>

      </div>

    );

  }

  /* ONLY OWNER ADMIN */
  if (
    !firebaseUser ||
    userRole !== "admin"
  ) {

    return (
      <div className="auth-page">

        <div className="auth-box">

          <h1>
            Akses Ditolak
          </h1>

          <p className="auth-subtitle">
            Halaman ini khusus admin
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Kembali ke Store
          </button>

        </div>

      </div>
    );

  }

  return (

    <div className="store">

      <Navbar />

      {/* CONTENT */}
      <section className="products-section">

        <h2>
          Kelola Produk
        </h2>

        {/* FORM */}
        <div className="auth-box">

          <input
            placeholder="Nama Item"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Harga"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Pilih Game
            </option>

            <option value="FISH IT (Roblox)">
              FISH IT (Roblox)
            </option>

          </select>

          <select
            value={subCategory}
            onChange={(e) =>
              setSubCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Pilih Kategori Item
            </option>

            <option value="Skin Rod">
              Skin Rod
            </option>

            <option value="Stuff">
              Stuff
            </option>

            <option value="Jasa Joki">
              Jasa Joki
            </option>

          </select>

          <input
            type="file"
            onChange={
              handleImage
            }
          />

          {image && (

            <img
              src={image}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius:
                  "16px",
                marginTop: "10px"
              }}
            />

          )}

          <button
            onClick={addProduct}
          >
            {editId
              ? "Update Produk"
              : "Tambah Produk"}
          </button>

        </div>

        {/* PRODUCT LIST */}
        <div className="product-grid">

          {products.map((item) => (

            <div
              className="card"
              key={item.id}
            >

              <div className="product-badge">
                {item.subCategory}
              </div>

              <img
                src={item.image}
                alt={item.name}
              />

              <h3>
                {item.name}
              </h3>

              <p>
                Rp{" "}
                {Number(
                  item.price
                ).toLocaleString(
                  "id-ID"
                )}
              </p>

              <p>
                {item.category}
              </p>

              <p>
                {item.subCategory}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop:
                    "auto"
                }}
              >

                <button
                  onClick={() =>
                    editProduct(
                      item
                    )
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      item.id
                    )
                  }
                >
                  Hapus
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* REKBER MONITOR */}
        <h2
          style={{
            marginTop: "80px"
          }}
        >
          Monitoring Rekber
        </h2>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(420px, 1fr))",

            gap: "25px",

            marginTop: "30px",

            alignItems: "start"
          }}
        >

          {rekberOrders.map(
            (item) => (

              <div
                key={item.id}
                className="profile-section rekber-monitor-card"
                style={{
                  margin: 0,
                  width: "100%",
                  minHeight: "500px",

                  display: "flex",
                  flexDirection: "column",

                  justifyContent: "space-between"
                }}
              >

                <h3
                  style={{
                    fontSize: "24px",
                    marginBottom: "18px",
                    color: "#ffd700"
                  }}
                >
                  {item.itemName}
                </h3>

                <div className="rekber-info-box">

                  <div className="rekber-info-row">

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

                      <span className="value gold">
                        {item.transactionId}
                      </span>

                      <button
                        onClick={() =>
                          copyTransactionId(
                            item.transactionId
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          padding: 0
                        }}
                      >
                        📋
                      </button>

                    </div>

                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Buyer
                    </span>

                    <span className="value">
                      {item.buyerUsername}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Seller
                    </span>

                    <span className="value">
                      {item.sellerUsername}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Status
                    </span>

                    <span
                      className={`value status-value ${item.status === "Done"
                        ? "success"
                        : "process"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Harga
                    </span>

                    <span className="value">
                      Rp{" "}
                      {Number(item.dealPrice).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Fee
                    </span>

                    <span className="value">
                      {item.feeType}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Fee Rekber
                    </span>

                    <span className="value green">
                      Rp{" "}
                      {Number(item.fee || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Total Bayar
                    </span>

                    <span className="value gold">
                      Rp{" "}
                      {Number(item.totalPayment || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="rekber-info-row">
                    <span className="label">
                      Rilis Seller
                    </span>

                    <span className="value red">
                      Rp{" "}
                      {Number(item.sellerReceive || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                </div>

                {item.status ===
                  "Menunggu Verifikasi Pembayaran" && (

                    <button
                      onClick={async () => {

                        await updateDoc(
                          doc(
                            db,
                            "rekberOrders",
                            item.id
                          ),
                          {
                            status:
                              "Menunggu Seller Mengirim Barang",

                            paymentStatus:
                              "Sudah Diverifikasi"
                          }
                        );

                        alert(
                          "Pembayaran berhasil diverifikasi"
                        );

                      }}
                    >
                      Verifikasi Pembayaran
                    </button>

                  )}

                {item.status ===
                  "Barang Sudah Diterima Buyer" && (

                    <button
                      onClick={async () => {

                        await updateDoc(
                          doc(
                            db,
                            "rekberOrders",
                            item.id
                          ),
                          {
                            status: "Done"
                          }
                        );

                        /* DISCORD WEBHOOK */
                        try {

                          await fetch(
                            "/api/discord",
                            {
                              method: "POST",

                              headers: {
                                "Content-Type":
                                  "application/json"
                              },

                              body: JSON.stringify({

                                webhookUrl:
                                  import.meta.env
                                    .VITE_DISCORD_WEBHOOK_REKBER,

                                embeds: [
                                  {

                                    title:
                                      "✅ Rekber Selesai",

                                    description:
                                      `Transaksi rekber telah selesai.`,

                                    color: 0x00ff9d,

                                    fields: [

                                      {
                                        name: "ID Transaksi",
                                        value:
                                          item.transactionId
                                            ? item.transactionId.slice(0, 10) +
                                            "****" +
                                            item.transactionId.slice(-4)
                                            : "-",
                                        inline: false
                                      },

                                      {
                                        name: "Buyer",
                                        value: item.buyerUsername || "-",
                                        inline: true
                                      },

                                      {
                                        name: "Seller",
                                        value: item.sellerUsername || "-",
                                        inline: true
                                      },

                                      {
                                        name: "Item",
                                        value: item.itemName || "-",
                                        inline: false
                                      },

                                      {
                                        name: "Game",
                                        value: item.game || "-",
                                        inline: true
                                      },

                                      {
                                        name: "Total",
                                        value:
                                          item.totalPayment
                                            ? `Rp ${"*".repeat(
                                              String(item.totalPayment).length - 4
                                            )}${String(item.totalPayment).slice(-4)}`
                                            : "-",
                                        inline: true
                                      },

                                      {
                                        name: "Status",
                                        value: "✅ TRANSAKSI SELESAI 😉",
                                        inline: false
                                      },

                                    ],

                                    footer: {
                                      text: "FS2B STORE • Automatic Rekber System"
                                    },

                                    timestamp:
                                      new Date().toISOString()

                                  }
                                ]

                              })

                            }
                          );

                        } catch (error) {

                          console.log(error);

                        }

                        alert(
                          "Rekber selesai"
                        );

                      }}
                    >
                      Selesaikan Rekber
                    </button>

                  )}

                <div
                  style={{
                    marginTop: "20px"
                  }}
                >

                  <h4
                    style={{
                      marginBottom: "14px",
                      color: "#ffd700"
                    }}
                  >
                    Monitoring Chat
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px"
                    }}
                  >

                    <button
                      onClick={() =>
                        toggleChatLock(
                          item.id,
                          item.chatLocked
                        )
                      }
                    >
                      {item.chatLocked
                        ? "Buka Chat"
                        : "Kunci Chat"}
                    </button>

                  </div>

                  {renderAdminChat(
                    item.id
                  )}

                </div>

              </div>

            )
          )}

        </div>

      </section >

    </div >

  );

}

export default Admin;