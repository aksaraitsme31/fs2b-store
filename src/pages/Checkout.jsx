import { useLocation } from "react-router-dom";
import { useState } from "react";

import qrisImage from "../assets/qris.jpeg";

function Checkout() {

  const { state } = useLocation();

  const product = state?.product;

  const [
    gameUsername,
    setGameUsername
  ] = useState("");

  const [proof, setProof] =
    useState("");

  if (!product) {
    return (
      <div className="auth-page">

        <div className="auth-box">

          <h1>
            Produk tidak ditemukan
          </h1>

        </div>

      </div>
    );
  }

  const handleProofUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      const reader =
        new FileReader();

      reader.onloadend = () => {

        setProof(
          reader.result
        );

      };

      reader.readAsDataURL(
        file
      );

    }

  };

  const handleOrder = () => {

    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

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

    const orders =
      JSON.parse(
        localStorage.getItem(
          "orders"
        )
      ) || [];

    const newOrder = {

      id: Date.now(),

      product:
        product.name,

      price:
        product.price,

      image:
        product.image,

      category:
        product.category,

      username:
        currentUser.username,

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
        )
    };

    orders.push(newOrder);

    localStorage.setItem(
      "orders",
      JSON.stringify(
        orders
      )
    );

    alert(
      "Pesanan berhasil dikirim ke admin"
    );

    setGameUsername("");
    setProof("");

  };

  return (
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
            marginBottom: "25px",
            color: "#ffd700",
            fontWeight: "bold"
          }}
        >
          Rp{" "}
          {Number(
            product.price
          ).toLocaleString(
            "id-ID"
          )}
        </p>

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
              product.price
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

        <button
          onClick={handleOrder}
        >
          Kirim Bukti Transfer
        </button>

      </div>

    </div>
  );
}

export default Checkout;