import {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

function Admin() {

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "currentUser"
      )
    );

  const navigate =
    useNavigate();

  /* PROTECT ADMIN */
  if (
    !currentUser ||
    currentUser.role !==
      "admin"
  ) {
    return (
      <div className="auth-page">

        <div className="auth-box">

          <h1>
            Akses Ditolak
          </h1>

          <p className="auth-subtitle">
            Halaman ini khusus admin
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Kembali ke Store
          </button>

        </div>

      </div>
    );
  }

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    subCategory,
    setSubCategory
  ] = useState("");

  /* EDIT MODE */
  const [editId, setEditId] =
    useState(null);

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "products"
        )
      ) || [];

    setProducts(saved);

  }, []);

  /* HANDLE IMAGE */
  const handleImage = (e) => {

    const file =
      e.target.files[0];

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(
        file
      );
    }
  };

  /* EDIT PRODUCT */
  const editProduct = (item) => {

    setEditId(item.id);

    setName(item.name);

    setPrice(item.price);

    setImage(item.image);

    setCategory(item.category);

    setSubCategory(
      item.subCategory
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* ADD / UPDATE PRODUCT */
  const addProduct = () => {

    if (
      !name ||
      !price ||
      !image ||
      !category ||
      !subCategory
    ) {
      alert(
        "Lengkapi semua data produk"
      );

      return;
    }

    /* UPDATE */
    if (editId) {

      const updated =
        products.map((item) =>
          item.id === editId
            ? {
                ...item,
                name,
                price,
                image,
                category,
                subCategory
              }
            : item
        );

      setProducts(updated);

      localStorage.setItem(
        "products",
        JSON.stringify(updated)
      );

      alert(
        "Produk berhasil diupdate"
      );

      setEditId(null);

    } else {

      /* ADD */
      const newProduct = {
        id: Date.now(),
        name,
        price,
        image,
        category,
        subCategory
      };

      const updated = [
        ...products,
        newProduct
      ];

      setProducts(updated);

      localStorage.setItem(
        "products",
        JSON.stringify(updated)
      );

      alert(
        "Produk berhasil ditambahkan"
      );
    }

    /* RESET FORM */
    setName("");

    setPrice("");

    setImage("");

    setCategory("");

    setSubCategory("");
  };

  /* DELETE */
  const deleteProduct = (id) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus produk?"
      );

    if (!confirmDelete) return;

    const updated =
      products.filter(
        (p) => p.id !== id
      );

    setProducts(updated);

    localStorage.setItem(
      "products",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="store">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          FS2B OWNER PANEL
        </div>

        <div className="menu">

          <a href="/">
            Store
          </a>

          <a href="/orders">
            Orders
          </a>

        </div>

      </nav>

      {/* CONTENT */}
      <section className="products-section">

        <h2>
          Kelola Produk
        </h2>

        {/* FORM */}
        <div className="auth-box">

          <input
            placeholder="Nama Item"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Harga"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Pilih Game
            </option>

            <option value="FISH IT (Roblox)">
              FISH IT (Roblox)
            </option>

          </select>

          <select
            value={subCategory}
            onChange={(e) =>
              setSubCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Pilih Kategori Item
            </option>

            <option value="Skin Rod">
              Skin Rod
            </option>

            <option value="Stuff">
              Stuff
            </option>

            <option value="Jasa Joki">
              Jasa Joki
            </option>

          </select>

          <input
            type="file"
            onChange={
              handleImage
            }
          />

          {/* PREVIEW IMAGE */}
          {image && (
            <img
              src={image}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "16px",
                marginTop: "10px"
              }}
            />
          )}

          <button
            onClick={addProduct}
          >
            {editId
              ? "Update Produk"
              : "Tambah Produk"}
          </button>

        </div>

        {/* PRODUCT LIST */}
        <div className="product-grid">

          {products.map((item) => (
            <div
              className="card"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <h3>
                {item.name}
              </h3>

              <p>
                Rp{" "}
                {Number(
                  item.price
                ).toLocaleString(
                  "id-ID"
                )}
              </p>

              <p>
                {item.category}
              </p>

              <p>
                {item.subCategory}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "auto"
                }}
              >

                <button
                  onClick={() =>
                    editProduct(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      item.id
                    )
                  }
                >
                  Hapus
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Admin;