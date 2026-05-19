import Navbar from "../components/Navbar";

import {
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

function Profile() {

  const navigate =
    useNavigate();

  const [
    currentUser,
    setCurrentUser
  ] = useState(null);

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

    const unsubscribe =
      onAuthStateChanged(auth, (user) => {

        if (!user) {

          navigate("/login");

        } else {

          setCurrentUser(user);

          setNewUsername(
            user.displayName || ""
          );

          setNewEmail(
            user.email || ""
          );

        }

      });

    return () => unsubscribe();

  }, []);

  const logout = async () => {

    await signOut(auth);

    navigate("/login");

  };

  const handleUpdateProfile =
    async () => {

      try {

        await updateProfile(
          auth.currentUser,
          {
            displayName:
              newUsername
          }
        );

        await auth.currentUser.reload();

        setCurrentUser(
          auth.currentUser
        );

        if (
          newEmail !==
          auth.currentUser.email
        ) {

          await updateEmail(
            auth.currentUser,
            newEmail
          );

        }

        alert(
          "Profile berhasil diupdate"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal update profile"
        );

      }

    };

  const changePassword =
    async () => {

      try {

        if (
          newPassword !==
          confirmPassword
        ) {

          alert(
            "Konfirmasi password tidak cocok"
          );

          return;

        }

        const credential =
          EmailAuthProvider.credential(
            currentUser.email,
            oldPassword
          );

        await reauthenticateWithCredential(
          currentUser,
          credential
        );

        await updatePassword(
          currentUser,
          newPassword
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

            {currentUser?.displayName}

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
              handleUpdateProfile
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