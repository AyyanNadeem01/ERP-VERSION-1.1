import React, { useState, useEffect } from "react";
import { getItems, addItem, deleteItem, updateItem } from "../services/itemService";
import "../styles/addItem.css";

function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [stock, setStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      alert("Failed to fetch items");
    }
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return alert("Please enter an item name");
    if (stock < 0) return alert("Stock cannot be negative");
    if (costPrice < 0) return alert("Cost price cannot be negative");

    try {
      await addItem({
        itemName: itemName.trim(),
        stock: Number(stock),
        costPrice: Number(costPrice),
      });
      setItemName("");
      setStock(0);
      setCostPrice(0);
      fetchItems();
    } catch (error) {
      alert("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  const handleUpdate = async (id, newStock, newCostPrice) => {
    if (newStock < 0 || newCostPrice < 0) return alert("Values cannot be negative");

    try {
      await updateItem(id, {
        stock: Number(newStock),
        costPrice: Number(newCostPrice),
      });
      fetchItems();
    } catch (error) {
      alert("Failed to update item");
    }
  };

  return (
    <div className="add-item-container">
      <h1>Add Item</h1>
      <form onSubmit={handleAddItem} className="add-item-form">
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Cost Price</label>
          <input
            type="number"
            placeholder="Enter cost price"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form>

      <h2>Current Items</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>Cost Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.itemName}</td>
                <td>
                  <input
                    type="number"
                    value={item.stock}
                    min="0"
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((i) =>
                          i._id === item._id
                            ? { ...i, stock: Number(e.target.value) }
                            : i
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.costPrice}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((i) =>
                          i._id === item._id
                            ? { ...i, costPrice: Number(e.target.value) }
                            : i
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdate(item._id, item.stock, item.costPrice)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AddItemPage;
