import "../App.css";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import toast from "react-hot-toast";

function AdminPtPtX8() {

    /* ==========================
            STATE
    ========================== */

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({

        title: "",

        eventDate: "",

        startTime: "",

        host: "",

        price: "",

        maxParticipants: "",

        registrationOpen: true

    });

    /* ==========================
        LOAD EVENTS REALTIME
    ========================== */

    useEffect(() => {

        const q = query(
            collection(db, "ptptx8Events"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe =
            onSnapshot(q, (snapshot) => {

                const data =
                    snapshot.docs.map(doc => ({

                        id: doc.id,

                        ...doc.data()

                    }));

                setEvents(data);

                setLoading(false);

            });

        return () => unsubscribe();

    }, []);

    /* ==========================
        INPUT CHANGE
    ========================== */

    const handleChange = (e) => {

        const {

            name,

            value,

            type,

            checked

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };

    /* ==========================
            RESET FORM
    ========================== */

    const resetForm = () => {

        setEditingId(null);

        setForm({

            title: "",

            eventDate: "",

            startTime: "",

            host: "",

            price: "",

            maxParticipants: "",

            registrationOpen: true

        });

    };

    /* ==========================
        VALIDASI
    ========================== */

    const validate = () => {

        if (!form.title.trim()) {

            toast.error("Judul event wajib diisi.");

            return false;

        }

        if (!form.eventDate) {

            toast.error("Tanggal event belum dipilih.");

            return false;

        }

        if (!form.startTime) {

            toast.error("Jam mulai belum dipilih.");

            return false;

        }

        if (!form.host.trim()) {

            toast.error("Host Roblox wajib diisi.");

            return false;

        }

        if (!form.price) {

            toast.error("Harga belum diisi.");

            return false;

        }

        if (!form.maxParticipants) {

            toast.error("Total slot belum diisi.");

            return false;

        }

        return true;

    };

    /* ==========================
        SIMPAN EVENT
    ========================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setSaving(true);

            const payload = {

                title: form.title,

                eventDate: form.eventDate,

                startTime: form.startTime,

                host: form.host,

                price: Number(form.price),

                maxParticipants:
                    Number(form.maxParticipants),

                participantCount: 0,

                registrationOpen:
                    form.registrationOpen,

                status: "OPEN",

                updatedAt:
                    serverTimestamp()

            };

            if (editingId) {

                await updateDoc(

                    doc(
                        db,
                        "ptptx8Events",
                        editingId
                    ),

                    payload

                );

                toast.success(
                    "Event berhasil diperbarui."
                );

            } else {

                await addDoc(

                    collection(
                        db,
                        "ptptx8Events"
                    ),

                    {

                        ...payload,

                        createdAt:
                            serverTimestamp()

                    }

                );

                toast.success(
                    "Event berhasil dibuat."
                );

            }

            resetForm();

        }

        catch (err) {

            console.log(err);

            toast.error(
                "Terjadi kesalahan."
            );

        }

        finally {

            setSaving(false);

        }

    };

    /* ==========================
            EDIT
    ========================== */

    const handleEdit = (event) => {

        setEditingId(event.id);

        setForm({

            title:
                event.title || "",

            eventDate:
                event.eventDate || "",

            startTime:
                event.startTime || "",

            host:
                event.host || "",

            price:
                event.price || "",

            maxParticipants:
                event.maxParticipants || "",

            registrationOpen:
                event.registrationOpen

        });

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    /* ==========================
            DELETE
    ========================== */

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Hapus event ini?"
            );

        if (!confirmDelete) return;

        try {

            await deleteDoc(

                doc(
                    db,
                    "ptptx8Events",
                    id
                )

            );

            toast.success(
                "Event berhasil dihapus."
            );

        }

        catch {

            toast.error(
                "Gagal menghapus event."
            );

        }

    };

    return (

        <>
            <Navbar />

            <div className="admin-ptx8-page">

                <div className="admin-ptx8-container">

                    {/* ==========================
                HEADER
        ========================== */}

                    <div className="admin-ptx8-header">

                        <div>

                            <h1>
                                🎣 PT PT X8 Event Manager
                            </h1>

                            <p>
                                Kelola seluruh event PT PT X8
                                yang akan muncul pada halaman
                                Store.
                            </p>

                        </div>

                    </div>

                    {/* ==========================
                FORM
        ========================== */}

                    <form
                        className="admin-ptx8-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Judul Event
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="PT PT X8 #12"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Tanggal Event
                                </label>

                                <input
                                    type="date"
                                    name="eventDate"
                                    value={form.eventDate}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Jam Mulai
                                </label>

                                <input
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Host Roblox
                                </label>

                                <input
                                    type="text"
                                    name="host"
                                    value={form.host}
                                    onChange={handleChange}
                                    placeholder="AksaGaming"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Harga
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="50000"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Total Slot
                                </label>

                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={form.maxParticipants}
                                    onChange={handleChange}
                                    placeholder="22"
                                />

                            </div>

                        </div>

                        <div className="checkbox-area">

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    name="registrationOpen"
                                    checked={
                                        form.registrationOpen
                                    }
                                    onChange={handleChange}
                                />

                                Registration Open

                            </label>

                        </div>

                        <div className="button-group">

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >

                                {
                                    saving
                                        ? "Menyimpan..."
                                        : editingId
                                            ? "Update Event"
                                            : "Simpan Event"
                                }

                            </button>

                            {
                                editingId && (

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={resetForm}
                                    >

                                        Batal Edit

                                    </button>

                                )
                            }

                        </div>

                    </form>

                    {/* ==========================
                LIST EVENT
        ========================== */}

                    <div className="event-list">

                        <h2>
                            📅 Daftar Event
                        </h2>

                        {

                            loading ? (

                                <div className="loading-box">

                                    Memuat Event...

                                </div>

                            ) :

                                events.length === 0 ? (

                                    <div className="empty-box">

                                        Belum ada Event PT PT X8.

                                    </div>

                                ) :

                                    events.map((event) => (

                                        <div
                                            className="event-card"
                                            key={event.id}
                                        >

                                            <div className="event-top">

                                                <div>

                                                    <h3>

                                                        {event.title}

                                                    </h3>

                                                    <span>

                                                        {event.status}

                                                    </span>

                                                </div>

                                            </div>

                                            <div className="event-body">

                                                <div>

                                                    <strong>
                                                        📅
                                                    </strong>

                                                    <span>

                                                        {
                                                            event.eventDate
                                                        }

                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        🕒
                                                    </strong>

                                                    <span>

                                                        {
                                                            event.startTime
                                                        }

                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        👤
                                                    </strong>

                                                    <span>

                                                        {
                                                            event.host
                                                        }

                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        💰
                                                    </strong>

                                                    <span>

                                                        Rp{" "}

                                                        {Number(
                                                            event.price
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}

                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        👥
                                                    </strong>

                                                    <span>

                                                        {
                                                            event.participantCount
                                                        }

                                                        /

                                                        {
                                                            event.maxParticipants
                                                        }

                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        Status
                                                    </strong>

                                                    <span>

                                                        {
                                                            event.registrationOpen
                                                                ? "OPEN"
                                                                : "CLOSED"
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                            <div className="event-actions">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(event)
                                                    }
                                                >

                                                    ✏ Edit

                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            event.id
                                                        )
                                                    }
                                                >

                                                    🗑 Hapus

                                                </button>

                                            </div>

                                        </div>

                                    ))

                        }

                    </div>

                </div>

                {/* ==========================
                    FOOTER
                ========================== */}

                <div className="admin-ptx8-footer">

                    <p>
                        Total Event :
                        <strong> {events.length}</strong>
                    </p>

                </div>

            </div>

        </>

    );

}

export default AdminPtPtX8;
