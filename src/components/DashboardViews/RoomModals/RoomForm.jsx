import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createRoom, updateRoom } from "../../../redux/slices/roomSlice";
import { X, Upload, Plus, Trash, Trash2 } from "lucide-react"; // Imported Trash2
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
    extraAdultPrice: 1000,
    extraChildPrice: 500,
  });

  const [amenities, setAmenities] = useState([]);
  const [furniture, setFurniture] = useState("");

  // Image States
  const [existingImages, setExistingImages] = useState([]); // 🟢 Images already on server
  const [selectedImages, setSelectedImages] = useState([]); // 🟢 New files to upload
  const [previewImages, setPreviewImages] = useState([]); // 🟢 Previews for new files

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
        extraAdultPrice: roomToEdit.extraAdultPrice || 1000,
        extraChildPrice: roomToEdit.extraChildPrice || 500,
      });

      if (Array.isArray(roomToEdit.amenities))
        setAmenities(roomToEdit.amenities);
      if (Array.isArray(roomToEdit.furniture))
        setFurniture(roomToEdit.furniture.join(", "));

      // 🟢 Load existing images into state
      if (Array.isArray(roomToEdit.images))
        setExistingImages(roomToEdit.images);
    }
  }, [isEdit, roomToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- IMAGE HANDLERS ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // 🟢 Remove an EXISTING image (from server)
  const removeExistingImage = (imageToDelete) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageToDelete));
  };

  // 🟢 Remove a NEW image (that hasn't been uploaded yet)
  const removeNewImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
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

    // Append NEW images
    selectedImages.forEach((file) => data.append("images", file));

    // 🟢 Append EXISTING images (as JSON string) so backend knows what to keep
    data.append("existingImages", JSON.stringify(existingImages));

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
          {/* ... Basic Info & Capacity Sections (No Changes) ... */}
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

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* --- IMAGES SECTION (UPDATED) --- */}
          <div className={styles.sectionTitle}>Images</div>
          <div className={styles.imageUpload}>
            <label className={styles.uploadBtn}>
              <Upload size={20} /> Add Images
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            <div className={styles.previewGrid}>
              {/* 🟢 Render EXISTING Images with Delete Button */}
              {existingImages.map((img, i) => (
                <div key={`exist-${i}`} className={styles.imgWrapper}>
                  <img src={img} alt="existing" className={styles.previewImg} />
                  <button
                    type="button"
                    className={styles.imgDeleteBtn}
                    onClick={() => removeExistingImage(img)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* 🟢 Render NEW Images with Delete Button */}
              {previewImages.map((src, i) => (
                <div key={`new-${i}`} className={styles.imgWrapper}>
                  <img src={src} alt="new" className={styles.previewImg} />
                  <button
                    type="button"
                    className={styles.imgDeleteBtn}
                    onClick={() => removeNewImage(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ... Amenities & Furniture (No Changes) ... */}
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
