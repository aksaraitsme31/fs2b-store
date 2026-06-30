import Navbar from "../components/Navbar";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

import toast from "react-hot-toast";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";

import {
  db,
  auth,
  realtimeDb
} from "../firebase/firebase";

import {
  ref,
  onValue
} from "firebase/database";

import qrisImage from "../assets/qris.jpeg";

function Checkout() {

  const navigate =
    useNavigate();

  const { state } =
    useLocation();

  const product =
    state?.product;

  const quantity =
    state?.quantity || 1;

  const totalPrice =
    product
      ? product.price * quantity
      : 0;

  const rewardCoin =
    Math.floor(totalPrice / 100);

  const [
    gameUsername,
    setGameUsername
  ] = useState("");

  const [proof, setProof] =
    useState("");

  const [adminOnline, setAdminOnline] =
    useState(false);

  useEffect(() => {

    const statusRef =
      ref(realtimeDb, "status/admin");

    const unsubscribe =
      onValue(statusRef, (snapshot) => {

        const data =
          snapshot.val();

        setAdminOnline(
          data?.online || false
        );

      });

    return () => unsubscribe();

  }, []);

  if (!product) {

    return (

      <div className="store">

        <Navbar />

        <div className="auth-page">

          <div className="auth-box">

            <h1>
              Produk tidak ditemukan
            </h1>

          </div>

        </div>

      </div>

    );

  }

  /* UPLOAD BUKTI */
  const handleProofUpload =
    (e) => {

      const file =
        e.target.files[0];

      if (file) {

        const reader =
          new FileReader();

        reader.onloadend =
          () => {

            setProof(
              reader.result
            );

          };

        reader.readAsDataURL(
          file
        );

      }

    };

  /* ORDER */
  const handleOrder =
    async () => {

      const currentUser =
        auth.currentUser;

      /* CEK LOGIN */
      if (!currentUser) {

        toast.error(
          "Silakan login terlebih dahulu 😀"
        );

        return;

      }

      /* CEK VERIFIKASI EMAIL */
      if (!currentUser.emailVerified) {

        toast.error(
          "Verifikasi email terlebih dahulu 😉"
        );

        return;

      }

      if (
        !gameUsername ||
        !proof
      ) {

        toast.error(
          "Lengkapi semua data 😠"
        );

        return;

      }

      try {

        const transactionId =
          `fs2bstore-${Date.now()}`;

        await addDoc(
          collection(
            db,
            "orders"
          ),
          {

            transactionId:
              transactionId,

            product:
              product.name,

            price:
              product.price,

            quantity,

            totalPrice,

            rewardCoin,
            coinRewarded: false,

            image:
              product.image,

            category:
              product.category,

            username:
              currentUser.displayName,

            email:
              currentUser.email,

            buyerUid:
              currentUser.uid,

            gameUsername,

            proof,

            status:
              "Menunggu Verifikasi",

            buyerUsername:
              currentUser.displayName || "Anonymous",

            rating: 0,

            feedback: "",

            feedbackSubmitted: false,

            createdAt:
              serverTimestamp(),

            date:
              new Date().toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }
              ),

            time:
              new Date().toLocaleTimeString(
                "id-ID",
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )

          }
        );

        await updateDoc(
          doc(
            db,
            "globalNotifications",
            "admin"
          ),
          {
            unreadOrders: increment(1)
          }
        );

        toast.success(
          "Pesanan berhasil dikirim 🚀"
        );

        setTimeout(() => {

          navigate("/my-orders");

        }, 800);

      } catch (error) {

        console.log(error);

        toast.error(
          "Gagal membuat pesanan 😩"
        );

      }

    };

  return (

    <div className="store">

      <Navbar />

      <div className="auth-page">

        <div className="auth-box">

          <h1>
            Checkout
          </h1>

          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              borderRadius: "18px",
              marginBottom: "20px"
            }}
          />

          <h2
            style={{
              marginBottom: "10px"
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              color: "#d1d5db",
              marginBottom: "10px"
            }}
          >
            Harga Satuan:
            {" "}
            Rp{" "}

            {Number(
              product.price
            ).toLocaleString(
              "id-ID"
            )}
          </p>

          <p
            style={{
              color: "#d1d5db",
              marginBottom: "10px"
            }}
          >
            Jumlah:
            {" "}
            {quantity}
          </p>

          <p
            style={{
              marginBottom: "25px",
              color: "#ffd700",
              fontWeight: "bold",
              fontSize: "22px"
            }}
          >
            Total:
            {" "}
            Rp{" "}

            {Number(
              totalPrice
            ).toLocaleString(
              "id-ID"
            )}

          </p>

          {/* QRIS */}
          <div className="qris-box">

            <h3
              style={{
                marginBottom: "15px"
              }}
            >
              Pembayaran QRIS
            </h3>

            <img
              src={qrisImage}
              alt="QRIS"
              className="qris-image"
            />

            <h2
              style={{
                marginTop: "20px"
              }}
            >

              Total Pembayaran

              <br />

              Rp{" "}

              {Number(
                totalPrice
              ).toLocaleString(
                "id-ID"
              )}

            </h2>

            <p
              className="qris-note"
              style={{
                marginTop: "15px"
              }}
            >
              Scan QRIS di atas
              lalu upload bukti
              transfer
            </p>

          </div>

          <input
            type="text"
            placeholder="Masukkan Username Roblox (@)"
            value={gameUsername}
            onChange={(e) =>
              setGameUsername(
                e.target.value
              )
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={
              handleProofUpload
            }
          />

          {proof && (

            <div
              style={{
                marginTop: "15px",
                width: "100%",
                overflow: "auto"
              }}
            >

              <img
                src={proof}
                alt="Preview Bukti Transfer"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "900px",
                  objectFit: "contain",
                  borderRadius: "16px",
                  display: "block",
                  margin: "0 auto"
                }}
              />

            </div>

          )}

          <button
            onClick={handleOrder}
            disabled={!adminOnline}
            style={{
              opacity:
                adminOnline ? 1 : 0.5,

              cursor:
                adminOnline
                  ? "pointer"
                  : "not-allowed"
            }}
          >

            {adminOnline
              ? "Kirim Bukti Transfer"
              : "Admin Sedang Offline"}

          </button>

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: adminOnline
                ? "#22c55e"
                : "#ef4444",
              textAlign: "center"
            }}
          >

            {adminOnline
              ? "Admin sedang online dan siap memverifikasi pembayaran"
              : "Transaksi sementara ditutup karena admin offline"}

          </p>

        </div>

      </div>

    </div>

  );
}

export default Checkout;