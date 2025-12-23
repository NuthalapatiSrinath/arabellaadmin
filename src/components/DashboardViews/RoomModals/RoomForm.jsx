import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createRoom, updateRoom } from "../../../redux/slices/roomSlice";
import { X, Upload, Plus, Trash } from "lucide-react";
import styles from "./RoomForm.module.css";

const RoomForm = ({ roomToEdit, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = !!roomToEdit;

  // --- STATE ---
  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    discountPercentage: 0,
    totalStock: 1,
    size: 300,
    dimensions: "10x10 ft",
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    baseCapacity: 2,
    minOccupancy: 1,
    description: "",
    extraAdultPrice: 1000, // Default for new rooms
    extraChildPrice: 500, // Default for new rooms
  });

  const [amenities, setAmenities] = useState([]);
  const [furniture, setFurniture] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // --- INITIALIZE FORM ---
  useEffect(() => {
    if (isEdit && roomToEdit) {
      setFormData({
        name: roomToEdit.name || "",
        basePrice: roomToEdit.basePrice || "",
        discountPercentage: roomToEdit.discountPercentage || 0,
        totalStock: roomToEdit.totalStock || 1,
        size: roomToEdit.size || 0,
        dimensions: roomToEdit.dimensions || "",
        maxAdults: roomToEdit.maxAdults || 2,
        maxChildren: roomToEdit.maxChildren || 0,
        maxOccupancy: roomToEdit.maxOccupancy || 2,
        baseCapacity: roomToEdit.baseCapacity || 2,
        minOccupancy: roomToEdit.minOccupancy || 1,
        description: roomToEdit.description || "",

        // 🚀 FIX: Read saved values from backend!
        extraAdultPrice: roomToEdit.extraAdultPrice || 1000,
        extraChildPrice: roomToEdit.extraChildPrice || 500,
      });

      if (Array.isArray(roomToEdit.amenities))
        setAmenities(roomToEdit.amenities);
      if (Array.isArray(roomToEdit.furniture))
        setFurniture(roomToEdit.furniture.join(", "));
    }
  }, [isEdit, roomToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const addAmenity = () => setAmenities([...amenities, { name: "", price: 0 }]);
  const updateAmenity = (index, field, value) => {
    const updated = [...amenities];
    updated[index][field] = value;
    setAmenities(updated);
  };
  const removeAmenity = (index) =>
    setAmenities(amenities.filter((_, i) => i !== index));

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    selectedImages.forEach((file) => data.append("images", file));
    data.append("amenities", JSON.stringify(amenities));
    data.append("furniture", furniture);

    if (isEdit) {
      dispatch(updateRoom({ id: roomToEdit._id, formData: data }));
    } else {
      dispatch(createRoom(data));
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isEdit ? "Edit Room" : "Add New Room"}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          {/* Section 1: Basic Info */}
          <div className={styles.sectionTitle}>Basic Details</div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Room Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Base Price (₹)</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Stock</label>
              <input
                type="number"
                name="totalStock"
                value={formData.totalStock}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Extra Charges (NOW WORKING) */}
          <div className={styles.sectionTitle}>Extra Person Charges</div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Extra Adult (₹)</label>
              <input
                type="number"
                name="extraAdultPrice"
                value={formData.extraAdultPrice}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Extra Child (₹)</label>
              <input
                type="number"
                name="extraChildPrice"
                value={formData.extraChildPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2: Dimensions & Capacity */}
          <div className={styles.sectionTitle}>Capacity & Size</div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Size (sq ft)</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Max Adults</label>
              <input
                type="number"
                name="maxAdults"
                value={formData.maxAdults}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Max Children</label>
              <input
                type="number"
                name="maxChildren"
                value={formData.maxChildren}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Max Occupancy</label>
              <input
                type="number"
                name="maxOccupancy"
                value={formData.maxOccupancy}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Section 3: Images */}
          <div className={styles.sectionTitle}>Images</div>
          <div className={styles.imageUpload}>
            <label className={styles.uploadBtn}>
              <Upload size={20} /> Select Images
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            <div className={styles.previewGrid}>
              {isEdit &&
                roomToEdit.images?.map((img, i) => (
                  <img
                    key={`old-${i}`}
                    src={img}
                    alt="old"
                    className={styles.previewImg}
                  />
                ))}
              {previewImages.map((src, i) => (
                <img
                  key={`new-${i}`}
                  src={src}
                  alt="new"
                  className={styles.previewImg}
                />
              ))}
            </div>
          </div>

          {/* Amenities & Furniture */}
          <div className={styles.sectionTitle}>Amenities & Furniture</div>
          <div className={styles.amenitiesList}>
            <button
              type="button"
              onClick={addAmenity}
              className={styles.addBtnSmall}
            >
              <Plus size={14} /> Add Amenity
            </button>
            {amenities.map((item, index) => (
              <div key={index} className={styles.amenityRow}>
                <input
                  value={item.name}
                  onChange={(e) => updateAmenity(index, "name", e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    updateAmenity(index, "price", e.target.value)
                  }
                  placeholder="Price"
                />
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className={styles.removeBtn}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.field} style={{ marginTop: 15 }}>
            <label>Furniture (Comma separated)</label>
            <input
              name="furniture"
              value={furniture}
              onChange={(e) => setFurniture(e.target.value)}
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {isEdit ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
