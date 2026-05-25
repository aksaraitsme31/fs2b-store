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
  reauthenticateWithCredential,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase/firebase";

import {
  BadgeCheck,
  ShieldAlert
} from "lucide-react";

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
  ] = useState("");

  const [
    newEmail,
    setNewEmail
  ] = useState("");

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

        const cleanUsername =
          newUsername
            .trim()
            .toLowerCase();

        const allowedAdminEmails = [
          "thirtyone.zerozero@gmail.com",
          "aufahisyam79@gmail.com"
        ];

        if (
          (
            cleanUsername.includes("admin") ||
            cleanUsername.includes("fs2b")
          ) &&
          !allowedAdminEmails.includes(
            email.trim().toLowerCase()
          )
        ) {

          alert(
            "Username tersebut tidak diperbolehkan 😤"
          );

          return;

        }

        /* CHECK USERNAME */

        /* CHECK USERNAME */
        const usernameQuery = query(
          collection(db, "users"),
          where(
            "username",
            "==",
            cleanUsername
          )
        );

        const usernameSnapshot =
          await getDocs(usernameQuery);

        const usernameUsedByOtherUser =
          usernameSnapshot.docs.find(
            (doc) =>
              doc.data().uid !==
              currentUser.uid
          );

        if (
          usernameUsedByOtherUser
        ) {

          alert(
            "Username sudah digunakan"
          );

          return;

        }

        /* UPDATE USERNAME AUTH */
        await updateProfile(
          auth.currentUser,
          {
            displayName:
              cleanUsername
          }
        );

        /* UPDATE EMAIL AUTH */
        if (
          newEmail !==
          auth.currentUser.email
        ) {

          await updateEmail(
            auth.currentUser,
            newEmail
          );

        }

        /* UPDATE FIRESTORE */
        await updateDoc(
          doc(
            db,
            "users",
            currentUser.uid
          ),
          {
            username:
              cleanUsername,
            email:
              newEmail
          }
        );

        await auth.currentUser.reload();

        setCurrentUser(
          auth.currentUser
        );

        alert(
          "Profile berhasil diupdate"
        );

      } catch (error) {

        console.log(error);

        if (
          error.code ===
          "auth/requires-recent-login"
        ) {

          alert(
            "Silahkan login ulang terlebih dahulu untuk mengubah email"
          );

        } else {

          alert(
            "Gagal update profile"
          );

        }

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

  const handleVerifyEmail =
    async () => {

      try {

        await sendEmailVerification(
          auth.currentUser
        );

        alert(
          "Email verifikasi berhasil dikirim"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengirim email verifikasi"
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

          {/* EMAIL VERIFICATION */}
          <div className="email-status">

            {currentUser?.emailVerified ? (

              <div className="verified-badge">

                <BadgeCheck size={18} />

                <span>
                  Email Sudah Terverifikasi
                </span>

              </div>

            ) : (

              <div className="unverified-box">

                <div className="unverified-badge">

                  <ShieldAlert size={18} />

                  <span>
                    Email Belum Diverifikasi
                  </span>

                </div>

                <button
                  className="verify-btn"
                  onClick={
                    handleVerifyEmail
                  }
                >
                  Verifikasi Email
                </button>

              </div>

            )}

          </div>

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