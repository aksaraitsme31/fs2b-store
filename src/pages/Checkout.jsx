import Navbar from "../components/Navbar";

import { useLocation } from "react-router-dom";

import { useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebase";

import qrisImage from "../assets/qris.jpeg";

function Checkout() {

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

  const [
    gameUsername,
    setGameUsername
  ] = useState("");

  const [proof, setProof] =
    useState("");

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

      if (!currentUser) {

        alert(
          "Silakan login dulu"
        );

        return;

      }

      if (
        !gameUsername ||
        !proof
      ) {

        alert(
          "Lengkapi semua data"
        );

        return;

      }

      try {

        await addDoc(
          collection(
            db,
            "orders"
          ),
          {

            product:
              product.name,

            price:
              product.price,

            quantity,

            totalPrice,

            image:
              product.image,

            category:
              product.category,

            username:
              currentUser.displayName,

            email:
              currentUser.email,

            gameUsername,

            proof,

            status:
              "Menunggu Verifikasi",

            date:
              new Date().toLocaleString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }
              ),

            createdAt:
              serverTimestamp()

          }
        );

        alert(
          "Pesanan berhasil dikirim"
        );

        setGameUsername("");

        setProof("");

      } catch (error) {

        console.log(error);

        alert(
          "Gagal membuat pesanan"
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
          >
            Kirim Bukti Transfer
          </button>

        </div>

      </div>

    </div>

  );
}

export default Checkout;