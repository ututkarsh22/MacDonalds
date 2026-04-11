import React, { useEffect, useState } from "react";
import "./AdminMenu.css";
import "../src/App.css"
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const AdminMenu = () => {

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const navigate = useNavigate();
  const categories = [
    "burgers",
    "chicken & sandwiches",
    "breakfast",
    "snacks & sides",
    "beverages",
    "desserts",
  ];

  const emptyForm = {
    name: "",
    description: "",
    price: 0,
    category: "burgers",
    image: null,
    isVegetarian: false,
    isPopular: false,
    stock: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
     
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/menu`, {
        method: "GET",
        credentials: "include"
      })

      const data = await res.json();
      setMenuItems(data.product);
    } catch (error) {

      console.log(error);
      toast.error(error.message);
    }
    finally{
      setLoading(false);
    }

  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const update = async (e) => {

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("image", form.image);
    formData.append("isVegetarian", form.isVegetarian);
    formData.append("isPopular", form.isPopular);
    formData.append("stock", form.stock);

    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/${editId}`, {
        method: "PUT",
        credentials: "include",
        
        body: formData,
      })

      const data = await res.json();
      console.log(data);
      setMenuItems(menuItems.map(item =>
        item._id === data.menuItem._id ? data.menuItem : item
      ));
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);


    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setShowForm(true);
  };

  const adding = async (e) => {

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("image", form.image);
    formData.append("isVegetarian", form.isVegetarian);
    formData.append("isPopular", form.isPopular);
    formData.append("stock", form.stock);

    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/create-menu`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json();
      console.log(data);
      setMenuItems([...menuItems, data.menuItem]);
      toast.success(data.message);
      setForm(emptyForm);
      setShowForm(false);

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);


  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-text">MacD is loading...</div>
      </div>
    );

  return (
    <div className="admin-container">

      {!showForm ? (
        <>
          <header className="admin-header">
              <button className="card-btn" onClick={() => {navigate("/admin")}}>Back</button>
            <div>
              <h1>Menu Dashboard</h1>
              <p>Manage your {menuItems.length} products</p>
            </div>

            <button className="add-btn-main" id="addProductBtn" onClick={handleAdd}>
              <span>+</span> Add Product
            </button>
          </header>


          <div className="category-bar">
            <button
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

       
          <div className="card-grid">
            {filteredItems.map((item) => (
              <div key={item._id} className="menu-card" onClick={() => handleEdit(item)}>
                <div className="image-wrapper">
                  {item.isPopular && <span className="badge-popular">Popular</span>}
                  <img src={item.image.url} alt={item.name} />
                  <div className="price-tag">₹ {item.price}</div>
                </div>
                <div className="card-details">
                  <div className="card-top">
                    <h3>{item.name}</h3>
                    {item.isVegetarian ? <span className="veg-icon"></span> : <span className="non-veg-icon"></span> }
                  </div>
                  <p>{item.description}</p>
                  <div className="card-footer">
                    <span className="stock-label">Stock: {item.stock}</span>
                    <span className="cat-label">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </>

      ) : (
        <div className="form-overlay">
          <div className="form-card">
            <header className="form-header">
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
              <h2>{editId ? "Update Product" : "Create Product"}</h2>
            </header>

            <div className="form-body">
              {/* Flex row for Name and Price */}
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    id="productName"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Big Mac"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="productPrice">(₹ )Price </label>
                  <input
                    id="productPrice"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="5.99"
                  />
                </div>
              </div>


              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="productCategory">Category</label>
                  <select
                    id="productCategory"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="productStock">Stock Count</label>
                  <input
                    id="productStock"
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label htmlFor="productDesc">Description</label>
                <textarea
                  id="productDesc"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell customers about this item..."
                />
              </div>

              <div className="input-group full-width">
                <label htmlFor="productImage">Image</label>
                <input
                  id="productImage"
                  name="image"
                  type = "file"
                  onChange={(e) =>{
                    setForm({...form,
                      image : e.target.files[0]})
                  }}
                />
              </div>

              <div className="checkbox-section">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={form.isVegetarian}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Vegetarian Option
                </label>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Mark as Popular
                </label>
              </div>
            </div>

            <footer className="form-actions">
              <button className="btn-secondary" id="discardBtn" onClick={() => setShowForm(false)}>
                Discard
              </button>
              <button className="btn-primary" id="saveBtn" onClick={editId ? update : adding}>
                Save Changes
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;