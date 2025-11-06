import React, { useState } from "react";
import { useNavigate } from "react-router";


interface Hall {
  id: string;
  name: string;
  seats: number;
  active: boolean;
}

interface Cinema {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  halls: Hall[];
}

interface AddCinemaProps {
  onAddCinema: (newCinema: Cinema) => void;
}

const AddCinema: React.FC<AddCinemaProps> = ({ onAddCinema }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [halls, setHalls] = useState<Hall[]>([]);
  const [audName, setAudName] = useState("");
  const [audSeats, setAudSeats] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleAddHall = () => {
    if (!audName || audSeats <= 0) return;
    setHalls((prev) => [
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

  const handleDeleteHall = (id: string) => {
    setHalls((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCinema: Cinema = {
      id: Date.now().toString(),
      name,
      address,
      phone,
      active: true,
      halls,
    };

    setSuccessMsg("Cinema added successfully!");
    setTimeout(() => {
      setSuccessMsg("");
      navigate("/admin/cinemas");
    }, 2000);
      console.log(newCinema)

  };



  const handleCancel = () => {
    navigate("/admin/cinemas");
  };

  return (
    <div>
      <h2>Add New Cinema</h2>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cinema Name:</label>
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

        <h3>Halls</h3>
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
          <button type="button" onClick={handleAddHall}>
            + Add Hall
          </button>
        </div>

        <ul>
          {halls.map((a) => (
            <li key={a.id}>
              {a.name} - {a.seats} seats
              <button
                type="button"
                style={{ marginLeft: "10px" }}
                onClick={() => handleDeleteHall(a.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* <button type="submit">Add Cinema</button> */}
        <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCinema;
