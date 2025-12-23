import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  deleteRoom,
  resetOperationStatus,
} from "../../redux/slices/roomSlice";
import { Plus, Trash2, Edit, Search, BedDouble, Users } from "lucide-react";
import RoomForm from "./RoomModals/RoomForm"; // Import the new form
import styles from "./ManageRooms.module.css"; // Uses existing CSS

const ManageRooms = () => {
  const dispatch = useDispatch();
  const { rooms, loading, operationSuccess } = useSelector(
    (state) => state.rooms
  );

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  // Refetch or Close Modal when operation succeeds
  useEffect(() => {
    if (operationSuccess) {
      dispatch(fetchRooms());
      setIsModalOpen(false);
      setEditingRoom(null);
      dispatch(resetOperationStatus()); // Reset so it doesn't loop
    }
  }, [operationSuccess, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(id));
    }
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && rooms.length === 0)
    return <div className={styles.loading}>Loading Rooms...</div>;

  return (
    <div className={styles.container}>
      {/* Header Actions */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={20} /> Add Room
        </button>
      </div>

      {/* Rooms Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Room Name</th>
              <th>Capacity</th>
              <th>Base Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td>
                    <div className={styles.imgWrapper}>
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className={styles.roomImg}
                        />
                      ) : (
                        <div className={styles.placeholderImg}>
                          <BedDouble size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.roomName}>{room.name}</div>
                    <div className={styles.roomSize}>{room.dimensions}</div>
                  </td>
                  <td>
                    <div className={styles.capacityBadge}>
                      <Users size={14} /> {room.maxAdults} Ad •{" "}
                      {room.maxChildren} Ch
                    </div>
                  </td>
                  <td className={styles.price}>₹{room.basePrice}</td>
                  <td>
                    <span
                      className={`${styles.stockBadge} ${
                        room.totalStock < 3 ? styles.lowStock : styles.inStock
                      }`}
                    >
                      {room.totalStock} Available
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditModal(room)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(room._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDER MODAL IF OPEN */}
      {isModalOpen && (
        <RoomForm
          roomToEdit={editingRoom}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageRooms;
