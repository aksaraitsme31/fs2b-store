import {
  useNavigate
} from "react-router-dom";

import {
  useEffect
} from "react";

function Profile() {
  const navigate =
    useNavigate();

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "currentUser"
      )
    );

  /* PROTECT PAGE */
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  /* LOGOUT */
  const logout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");

    window.location.reload();
  };

  /* USER ORDERS */
  const userOrders = (
    JSON.parse(
      localStorage.getItem(
        "orders"
      )
    ) || []
  )
    .filter(
      (order) =>
        order.username ===
        currentUser?.username
    )
    .reverse();

  return (
    <div className="profile-page">

      <h1>
        Profil Saya
      </h1>

      {/* INFO ACCOUNT */}
      <div className="profile-card">

        <p>
          <strong>
            Username:
          </strong>{" "}
          {currentUser?.username}
        </p>

        <p>
          <strong>
            Email:
          </strong>{" "}
          {currentUser?.email ||
            "Belum ada email"}
        </p>

        <p>
          <strong>
            Join:
          </strong>{" "}
          {currentUser?.joinDate ||
            "11 Mei 2026"}
        </p>

        <p>
          <strong>
            Status:
          </strong>{" "}
          Buyer Active
        </p>

      </div>

      {/* EDIT PROFILE */}
      <div className="profile-section">

        <h2>
          Edit Profile
        </h2>

        <input placeholder="Username baru" />

        <input placeholder="Email baru" />

        <button>
          Update Profile
        </button>

      </div>

      {/* UBAH PASSWORD */}
      <div className="profile-section">

        <h2>
          Ubah Password
        </h2>

        <input
          type="password"
          placeholder="Password lama"
        />

        <input
          type="password"
          placeholder="Password baru"
        />

        <input
          type="password"
          placeholder="Konfirmasi password baru"
        />

        <button>
          Ubah Password
        </button>

      </div>

      {/* HISTORI */}
      <div className="profile-section">

        <h2>
          Histori Transaksi
        </h2>

        {userOrders.length === 0 ? (

          <div className="empty-products">
            Belum ada transaksi
          </div>

        ) : (

          userOrders
            .slice(0, 3)
            .map((order) => (

              <div
                className="history-card"
                key={order.id}
              >

                <img
                  src={order.image}
                  alt={order.product}
                  className="history-image"
                />

                <div className="history-info">

                  <h3>
                    {order.product}
                  </h3>

                  <p>
                    {order.date}
                  </p>

                  <p>
                    Nickname:
                    {" "}
                    {order.nickname}
                  </p>

                  <p>
                    Rp{" "}
                    {Number(
                      order.price
                    ).toLocaleString(
                      "id-ID"
                    )}
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

                </div>

              </div>
            ))
        )}

        {/* BUTTON DETAIL */}
        {userOrders.length > 0 && (
          <button
            style={{
              marginTop: "25px"
            }}
            onClick={() =>
              navigate("/my-orders")
            }
          >
            Lihat Semua Riwayat
          </button>
        )}

      </div>

      {/* LOGOUT */}
      <div className="profile-section">

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;