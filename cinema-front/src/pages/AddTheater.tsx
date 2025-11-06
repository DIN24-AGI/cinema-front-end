import React, { useState } from "react";
import { useNavigate } from "react-router";


interface Auditorium {
  id: string;
  name: string;
  seats: number;
  active: boolean;
}

interface Theater {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  auditoriums: Auditorium[];
}

interface AddTheaterProps {
  onAddTheater: (newTheater: Theater) => void;
}

const AddTheater: React.FC<AddTheaterProps> = ({ onAddTheater }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [audName, setAudName] = useState("");
  const [audSeats, setAudSeats] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleAddAuditorium = () => {
    if (!audName || audSeats <= 0) return;
    setAuditoriums((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        name: audName,
        seats: audSeats,
        active: true,
      },
    ]);
    setAudName("");
    setAudSeats(0);
  };

  const handleDeleteAuditorium = (id: string) => {
    setAuditoriums((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTheater: Theater = {
      id: Date.now().toString(),
      name,
      address,
      phone,
      active: true,
      auditoriums,
    };

    onAddTheater(newTheater);
    setSuccessMsg("Theater added successfully!");
    setTimeout(() => {
      setSuccessMsg("");
      navigate("/admin/theaters");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/admin/theaters");
  };

  return (
    <div>
      <h2>Add New Theater</h2>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Theater Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <h3>Auditoriums (optional)</h3>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={audName}
            onChange={(e) => setAudName(e.target.value)}
          />
          <label>Seats:</label>
          <input
            type="number"
            value={audSeats}
            onChange={(e) => setAudSeats(parseInt(e.target.value))}
          />
          <button type="button" onClick={handleAddAuditorium}>
            + Add Auditorium
          </button>
        </div>

        <ul>
          {auditoriums.map((a) => (
            <li key={a.id}>
              {a.name} - {a.seats} seats
              <button
                type="button"
                style={{ marginLeft: "10px" }}
                onClick={() => handleDeleteAuditorium(a.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <button type="submit">Add Theater</button>
        <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddTheater;
