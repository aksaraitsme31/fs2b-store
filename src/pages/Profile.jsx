import Navbar from "../components/Navbar";

import {
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
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

  const [
    newUsername,
    setNewUsername
  ] = useState(
    currentUser?.username || ""
  );

  const [
    newEmail,
    setNewEmail
  ] = useState(
    currentUser?.email || ""
  );

  const [
    oldPassword,
    setOldPassword
  ] = useState("");

  const [
    newPassword,
    setNewPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  useEffect(() => {

    if (!currentUser) {

      navigate("/login");

    }

  }, []);

  const logout = () => {

    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");

    window.location.reload();

  };

  const updateProfile = () => {

    try {

      const updatedUser = {

        ...currentUser,

        username:
          newUsername,

        email:
          newEmail

      };

      localStorage.setItem(
        "currentUser",

        JSON.stringify(
          updatedUser
        )
      );

      alert(
        "Profile berhasil diupdate"
      );

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        "Gagal update profile"
      );

    }

  };

  const changePassword = () => {

    if (
      oldPassword !==
      currentUser.password
    ) {

      alert(
        "Password lama salah"
      );

      return;

    }

    if (
      newPassword !==
      confirmPassword
    ) {

      alert(
        "Konfirmasi password tidak cocok"
      );

      return;

    }

    if (
      newPassword.length < 6
    ) {

      alert(
        "Password minimal 6 karakter"
      );

      return;

    }

    try {

      const updatedUser = {

        ...currentUser,

        password:
          newPassword

      };

      localStorage.setItem(

        "currentUser",

        JSON.stringify(
          updatedUser
        )

      );

      alert(
        "Password berhasil diubah"
      );

      setOldPassword("");

      setNewPassword("");

      setConfirmPassword("");

    } catch (error) {

      console.log(error);

      alert(
        "Gagal mengubah password"
      );

    }

  };

  return (

    <div className="store">

      <Navbar />

      <div className="profile-page">

        {/* PROFILE INFO */}
        <div className="profile-card">

          <p>

            <strong>
              Username:
            </strong>

            {" "}

            {currentUser?.username}

          </p>

          <p>

            <strong>
              Email:
            </strong>

            {" "}

            {currentUser?.email}

          </p>

        </div>

        {/* EDIT PROFILE */}
        <div className="profile-section">

          <h2>
            Edit Profile
          </h2>

          <input
            type="text"
            value={newUsername}
            onChange={(e) =>

              setNewUsername(
                e.target.value
              )

            }
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) =>

              setNewEmail(
                e.target.value
              )

            }
          />

          <button
            onClick={
              updateProfile
            }
          >
            Update Profile
          </button>

        </div>

        {/* CHANGE PASSWORD */}
        <div className="profile-section">

          <h2>
            Ubah Password
          </h2>

          <input
            type="password"
            placeholder="Password lama"
            value={oldPassword}
            onChange={(e) =>

              setOldPassword(
                e.target.value
              )

            }
          />

          <input
            type="password"
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) =>

              setNewPassword(
                e.target.value
              )

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

          <button
            onClick={
              changePassword
            }
          >
            Ubah Password
          </button>

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

    </div>

  );

}

export default Profile;