import Navbar from "../components/Navbar";

import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    where
} from "firebase/firestore";

import {
    db,
    auth
} from "../firebase/firebase";

function RekberSaya() {

    const currentUser =
        auth.currentUser;

    const fileInputRefs =
        useRef({});

    const [
        userRekber,
        setUserRekber
    ] = useState([]);

    const [
        sellerRekber,
        setSellerRekber
    ] = useState([]);

    const [
        rekberMessages,
        setRekberMessages
    ] = useState([]);

    const [
        chatInputs,
        setChatInputs
    ] = useState({});

    const [
        chatMedia,
        setChatMedia
    ] = useState({});

    /* LOAD REKBER */
    useEffect(() => {

        if (!currentUser?.uid) return;

        const buyerQuery = query(
            collection(
                db,
                "rekberOrders"
            ),
            where(
                "buyerId",
                "==",
                currentUser.uid
            )
        );

        const unsubscribeBuyer =
            onSnapshot(
                buyerQuery,
                (snapshot) => {

                    const data =
                        snapshot.docs.map(
                            (doc) => ({
                                id: doc.id,
                                ...doc.data()
                            })
                        );

                    setUserRekber(
                        data.sort(
                            (a, b) =>
                                (
                                    b.createdAt?.seconds ||
                                    b.createdAt ||
                                    0
                                ) -
                                (
                                    a.createdAt?.seconds ||
                                    a.createdAt ||
                                    0
                                )
                        )
                    );

                }
            );

        const sellerQuery = query(
            collection(
                db,
                "rekberOrders"
            ),
            where(
                "sellerId",
                "==",
                currentUser.uid
            )
        );

        const unsubscribeSeller =
            onSnapshot(
                sellerQuery,
                (snapshot) => {

                    const data =
                        snapshot.docs.map(
                            (doc) => ({
                                id: doc.id,
                                ...doc.data()
                            })
                        );

                    setSellerRekber(
                        data.sort(
                            (a, b) =>
                                (
                                    b.createdAt?.seconds ||
                                    b.createdAt ||
                                    0
                                ) -
                                (
                                    a.createdAt?.seconds ||
                                    a.createdAt ||
                                    0
                                )
                        )
                    );

                }
            );

        return () => {

            unsubscribeBuyer();
            unsubscribeSeller();

        };

    }, [currentUser]);

    /* LOAD CHAT */
    useEffect(() => {

        if (!currentUser?.uid) return;

        const q = query(
            collection(db, "rekberMessages"),
            where(
                "participants",
                "array-contains",
                currentUser.uid
            ),
            orderBy("createdAt", "asc")
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

                    setRekberMessages(data);

                }
            );

        return () => unsubscribe();

    }, [currentUser]);

    /* SELLER KIRIM */
    const sendItemRekber =
        async (id) => {

            await updateDoc(
                doc(
                    db,
                    "rekberOrders",
                    id
                ),
                {
                    status:
                        "Seller Sudah Mengirim Barang"
                }
            );

        };

    /* BUYER TERIMA */
    const completeRekber =
        async (id) => {

            await updateDoc(
                doc(
                    db,
                    "rekberOrders",
                    id
                ),
                {
                    status:
                        "Barang Sudah Diterima Buyer"
                }
            );

        };

    /* CHAT */
    const sendChat =
        async (
            rekberId,
            isLocked
        ) => {

            if (isLocked) return;

            const message =
                chatInputs[rekberId];

            const mediaFile =
                chatMedia[rekberId];

            if (
                !message?.trim() &&
                !mediaFile
            ) return;

            try {

                let mediaUrl = "";
                let mediaType = "";

                /* UPLOAD CLOUDINARY */
                if (mediaFile) {

                    const formData =
                        new FormData();

                    formData.append(
                        "file",
                        mediaFile
                    );

                    formData.append(
                        "upload_preset",
                        "fs2b_rekber"
                    );

                    const response =
                        await fetch(
                            "https://api.cloudinary.com/v1_1/dubdwcahm/auto/upload",
                            {
                                method: "POST",
                                body: formData
                            }
                        );

                    const data =
                        await response.json();

                    mediaUrl =
                        data.secure_url;

                    mediaType =
                        mediaFile.type.startsWith("video")
                            ? "video"
                            : "image";

                }

                const rekberData =
                    userRekber.find(
                        (item) => item.id === rekberId
                    ) ||

                    sellerRekber.find(
                        (item) => item.id === rekberId
                    );

                const buyerId =
                    rekberData?.buyerId;

                const sellerId =
                    rekberData?.sellerId;

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

                        buyerId,

                        sellerId,

                        participants: [
                            buyerId,
                            sellerId,
                            ...adminIds
                        ],

                        senderId:
                            currentUser.uid,

                        sender:
                            currentUser.displayName,

                        username:
                            currentUser.displayName,

                        role:
                            currentUser.displayName ===
                                rekberData?.buyerUsername
                                ? "BUYER"
                                : "SELLER",

                        message:
                            message || "",

                        media:
                            mediaUrl,

                        mediaType:
                            mediaType,

                        createdAt:
                            serverTimestamp()

                    }
                );

                setChatInputs({
                    ...chatInputs,
                    [rekberId]: ""
                });

                setChatMedia({
                    ...chatMedia,
                    [rekberId]: null
                });

                if (
                    fileInputRefs.current[
                    rekberId
                    ]
                ) {

                    fileInputRefs.current[
                        rekberId
                    ].value = "";

                }

            } catch (error) {

                console.log(error);

            }

        };

    const handleKeyPress =
        (
            e,
            rekberId,
            isLocked
        ) => {

            if (e.key === "Enter") {

                sendChat(
                    rekberId,
                    isLocked
                );

            }

        };

    /* STATUS COLOR */
    const getStatusClass =
        (status) => {

            if (
                status ===
                "Barang Sudah Diterima Buyer" ||

                status ===
                "Done"
            ) {
                return "success";
            }

            if (
                status ===
                "Menunggu Seller Mengirim Barang" ||

                status ===
                "Seller Sudah Mengirim Barang" ||

                status ===
                "Sudah Dibayar"
            ) {
                return "process";
            }

            return "pending";

        };

    /* RENDER CHAT */
    const renderChat =
        (
            rekberId,
            isLocked
        ) => {

            const filteredMessages =
                rekberMessages.filter(
                    (msg) =>
                        msg.rekberId ===
                        rekberId
                );

            return (

                <div className="chat-box">

                    <h4>
                        Chat Rekber
                    </h4>

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
                                            msg.sender === currentUser.displayName
                                                ? "my-chat"
                                                : "other-chat"
                                        }
                                    >

                                        <strong>

                                            {msg.sender === "ADMIN"

                                                ? "ADMIN"

                                                : msg.role
                                                    ? `${msg.username} (${msg.role})`

                                                    : msg.username}

                                        </strong>

                                        <p>
                                            {msg.message}
                                        </p>

                                        {msg.media &&
                                            msg.mediaType === "image" && (

                                                <img
                                                    src={msg.media}
                                                    alt="media"
                                                    style={{
                                                        width: "220px",
                                                        marginTop: "10px",
                                                        borderRadius: "12px"
                                                    }}
                                                />

                                            )}

                                        {msg.media &&
                                            msg.mediaType === "video" && (

                                                <video
                                                    controls
                                                    style={{
                                                        width: "240px",
                                                        marginTop: "10px",
                                                        borderRadius: "12px"
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

                    <div
                        style={{
                            marginTop: "15px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

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
                                handleKeyPress(
                                    e,
                                    rekberId,
                                    isLocked
                                )
                            }
                            onChange={(e) =>
                                setChatInputs({
                                    ...chatInputs,
                                    [rekberId]: e.target.value
                                })
                            }
                        />

                        <input
                            type="file"
                            ref={(el) =>
                                fileInputRefs.current[rekberId] = el
                            }
                            accept="image/*,video/*"
                            onChange={(e) => {

                                const file =
                                    e.target.files[0];

                                if (!file) return;

                                if (
                                    file.size >
                                    20 * 1024 * 1024
                                ) {

                                    alert(
                                        "File maksimal 20MB"
                                    );

                                    return;
                                }

                                setChatMedia({
                                    ...chatMedia,
                                    [rekberId]: file
                                });

                            }}
                        />

                        {chatMedia[rekberId] && (

                            <div
                                style={{
                                    marginTop: "10px"
                                }}
                            >

                                {chatMedia[
                                    rekberId
                                ].type.startsWith("image") ? (

                                    <img
                                        src={URL.createObjectURL(
                                            chatMedia[rekberId]
                                        )}
                                        alt="preview"
                                        style={{
                                            width: "150px",
                                            borderRadius: "12px"
                                        }}
                                    />

                                ) : (

                                    <video
                                        controls
                                        style={{
                                            width: "180px",
                                            borderRadius: "12px"
                                        }}
                                    >
                                        <source
                                            src={URL.createObjectURL(
                                                chatMedia[rekberId]
                                            )}
                                        />
                                    </video>

                                )}

                            </div>

                        )}

                        <button
                            disabled={isLocked}
                            onClick={() =>
                                sendChat(
                                    rekberId,
                                    isLocked
                                )
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

                {/* BUYER */}
                <div className="profile-section">

                    <h2>
                        Rekber Saya
                    </h2>

                    {userRekber.map(
                        (item) => (

                            <div
                                className="history-card"
                                key={
                                    item.id +
                                    item.status
                                }
                            >

                                <div className="history-info">

                                    <h3>
                                        {item.itemName}
                                    </h3>

                                    <div className="rekber-info-row">
                                        <span className="label">
                                            ID Transaksi
                                        </span>

                                        <span className="value gold">
                                            {item.transactionId}
                                        </span>
                                    </div>

                                    <div className="rekber-info-box">

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
                                                Game
                                            </span>

                                            <span className="value">
                                                {item.game}
                                            </span>
                                        </div>

                                        <div className="rekber-info-row">
                                            <span className="label">
                                                Harga
                                            </span>

                                            <span className="value">
                                                Rp{" "}
                                                {Number(
                                                    item.dealPrice
                                                ).toLocaleString("id-ID")}
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
                                                Rilis Seller
                                            </span>

                                            <span className="value">
                                                Rp{" "}
                                                {Number(
                                                    item.sellerReceive || 0
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        <div className="rekber-info-row">
                                            <span className="label">
                                                Status
                                            </span>

                                            <span
                                                className={`value status-value ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                    </div>

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

                        )
                    )}

                </div>

                {/* SELLER */}
                <div className="profile-section">

                    <h2>
                        Rekber Seller
                    </h2>

                    {sellerRekber.map(
                        (item) => (

                            <div
                                className="history-card"
                                key={
                                    item.id +
                                    item.status
                                }
                            >

                                <div className="history-info">

                                    <h3>
                                        {item.itemName}
                                    </h3>

                                    <div className="rekber-info-row">
                                        <span className="label">
                                            ID Transaksi
                                        </span>

                                        <span className="value gold">
                                            {item.transactionId}
                                        </span>
                                    </div>

                                    <div className="rekber-info-box">

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
                                                Game
                                            </span>

                                            <span className="value">
                                                {item.game}
                                            </span>
                                        </div>

                                        <div className="rekber-info-row">
                                            <span className="label">
                                                Harga
                                            </span>

                                            <span className="value">
                                                Rp{" "}
                                                {Number(
                                                    item.dealPrice
                                                ).toLocaleString("id-ID")}
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
                                                Rilis Seller
                                            </span>

                                            <span className="value green">
                                                Rp{" "}
                                                {Number(
                                                    item.sellerReceive || 0
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        <div className="rekber-info-row">
                                            <span className="label">
                                                Status
                                            </span>

                                            <span
                                                className={`value status-value ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                    </div>

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

                        )
                    )}

                </div>

            </div>

        </div>

    );

}

export default RekberSaya;