import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function Profile() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const chatEndRef = useRef(null);

  const [newUsername, setNewUsername] = useState(
    currentUser?.username || ""
  );

  const [newEmail, setNewEmail] = useState(
    currentUser?.email || ""
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userRekber, setUserRekber] = useState([]);
  const [sellerRekber, setSellerRekber] = useState([]);

  const [rekberMessages, setRekberMessages] = useState([]);
  const [chatInputs, setChatInputs] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [rekberMessages]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "rekberOrders"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setUserRekber(
          [...data]
            .filter(
              (item) =>
                item.buyerUsername === currentUser?.username
            )
            .sort(
              (a, b) => b.createdAt - a.createdAt
            )
        );

        setSellerRekber(
          [...data]
            .filter(
              (item) =>
                item.sellerUsername === currentUser?.username
            )
            .sort(
              (a, b) => b.createdAt - a.createdAt
            )
        );

      }
    );

    return () => unsubscribe();

  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "rekberMessages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setRekberMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
    window.location.reload();
  };

  const updateProfile = () => {
    try {
      const updatedUser = {
        ...currentUser,
        username: newUsername,
        email: newEmail
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      alert("Profile berhasil diupdate");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Gagal update profile");
    }
  };

  const changePassword = () => {
    if (oldPassword !== currentUser.password) {
      alert("Password lama salah");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        password: newPassword
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      alert("Password berhasil diubah");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      alert("Gagal mengubah password");
    }
  };

  const payRekber = async (id) => {
    await updateDoc(doc(db, "rekberOrders", id), {
      status: "Sudah Dibayar",
      paymentStatus: "Sudah Dibayar"
    });
  };

  const sendItemRekber = async (id) => {
    await updateDoc(doc(db, "rekberOrders", id), {
      status: "Seller Sudah Mengirim Barang"
    });
  };

  const completeRekber = async (id) => {
    await updateDoc(doc(db, "rekberOrders", id), {
      status: "Barang Sudah Diterima Buyer"
    });
  };

  const sendChat = async (rekberId, isLocked) => {
    if (isLocked) return;

    const message = chatInputs[rekberId];
    if (!message?.trim()) return;

    await addDoc(
      collection(db, "rekberMessages"),
      {
        rekberId,

        sender: currentUser.username,

        username:
          currentUser.username,

        role:
          currentUser.username ===
            (
              userRekber.find(
                (item) =>
                  item.id === rekberId
              )?.buyerUsername ||

              sellerRekber.find(
                (item) =>
                  item.id === rekberId
              )?.buyerUsername
            )
            ? "BUYER"
            : "SELLER",

        message,

        createdAt: serverTimestamp()
      }
    );

    setChatInputs({
      ...chatInputs,
      [rekberId]: ""
    });
  };

  const handleKeyPress = (e, rekberId) => {
    if (e.key === "Enter") {
      sendChat(rekberId);
    }
  };

  const getStatusClass = (status) => {
    if (
      status === "Barang Sudah Diterima Buyer" ||
      status === "Done"
    )
      return "success";

    if (
      status === "Menunggu Seller Mengirim Barang" ||
      status === "Seller Sudah Mengirim Barang" ||
      status === "Sudah Dibayar"
    )
      return "process";

    return "pending";
  };

  const renderChat = (rekberId, isLocked) => {
    const filteredMessages = rekberMessages.filter(
      (msg) => msg.rekberId === rekberId
    );

    return (
      <div className="chat-box">
        <h4>Chat Rekber</h4>

        <div className="chat-messages">
          {filteredMessages.length === 0 ? (
            <p>Belum ada chat</p>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === currentUser.username
                    ? "my-chat"
                    : "other-chat"
                }
              >
                <strong>

                  {msg.sender === "ADMIN"
                    ? "ADMIN"

                    : msg.role
                      ? `${msg.username || msg.sender} (${msg.role})`

                      : msg.username || msg.sender}

                </strong>
                <p>{msg.message}</p>
              </div>
            ))
          )}

          <div ref={chatEndRef} />
        </div>

        <div>
          <input
            type="text"
            placeholder={
              isLocked
                ? "Chat dikunci admin"
                : "Tulis pesan..."
            }
            disabled={isLocked}
            value={chatInputs[rekberId] || ""}
            onKeyDown={(e) =>
              handleKeyPress(e, rekberId)
            }
            onChange={(e) =>
              setChatInputs({
                ...chatInputs,
                [rekberId]: e.target.value
              })
            }
          />

          <button
            disabled={isLocked}
            onClick={() =>
              sendChat(rekberId, isLocked)
            }
          >
            Kirim
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="store">
      <Navbar />

      <div className="profile-page">

        <div className="profile-card">
          <p>
            <strong>Username:</strong>{" "}
            {currentUser?.username}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {currentUser?.email}
          </p>
        </div>

        <div className="profile-section">
          <h2>Edit Profile</h2>

          <input
            type="text"
            value={newUsername}
            onChange={(e) =>
              setNewUsername(e.target.value)
            }
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) =>
              setNewEmail(e.target.value)
            }
          />

          <button onClick={updateProfile}>
            Update Profile
          </button>
        </div>

        <div className="profile-section">
          <h2>Ubah Password</h2>

          <input
            type="password"
            placeholder="Password lama"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          <button onClick={changePassword}>
            Ubah Password
          </button>
        </div>

        <div className="profile-section">
          <h2>Rekber Saya</h2>

          {userRekber.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >
              <div className="history-info">

                <h3>{item.itemName}</h3>

                <p>
                  Seller: {item.sellerUsername}
                </p>

                <p>
                  Game: {item.game}
                </p>

                <p>
                  Harga: Rp{" "}
                  {Number(
                    item.dealPrice
                  ).toLocaleString("id-ID")}
                </p>

                <p>
                  Status:
                  <span
                    className={`status-text ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </p>

                {item.status ===
                  "Menunggu Verifikasi Pembayaran" && (
                    <button
                      onClick={() =>
                        payRekber(item.id)
                      }
                    >
                      Bayar
                    </button>
                  )}

                {item.status ===
                  "Seller Sudah Mengirim Barang" && (
                    <button
                      onClick={() =>
                        completeRekber(item.id)
                      }
                    >
                      Barang Sudah Diterima
                    </button>
                  )}

                {renderChat(
                  item.id,
                  item.chatLocked
                )}

              </div>
            </div>
          ))}
        </div>

        <div className="profile-section">
          <h2>Rekber Seller</h2>

          {sellerRekber.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >
              <div className="history-info">

                <h3>{item.itemName}</h3>

                <p>
                  Buyer: {item.buyerUsername}
                </p>

                <p>
                  Game: {item.game}
                </p>

                <p>
                  Harga: Rp{" "}
                  {Number(
                    item.dealPrice
                  ).toLocaleString("id-ID")}
                </p>

                <p>
                  Status:
                  <span
                    className={`status-text ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </p>

                {item.status ===
                  "Menunggu Seller Mengirim Barang" && (
                    <button
                      onClick={() =>
                        sendItemRekber(item.id)
                      }
                    >
                      Barang Sudah Dikirim
                    </button>
                  )}

                {renderChat(
                  item.id,
                  item.chatLocked
                )}

              </div>
            </div>
          ))}
        </div>

        <div className="profile-section">
          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;