import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

type Seat = {
  seat_uid: string;
  row: number;
  number: number;
  seat_status: "free" | "reserved" | "sold" | "blocked";
};

function SeatsPage() {
  const { showtime_uid } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);


  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_ENDPOINTS.seats}?showtime_uid=${showtime_uid}`);
      const data = await res.json();
      setSeats(data);
    };
    load();
  }, [showtime_uid]);

  // group by row
  const rows = seats.reduce((acc: any, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const toggleSeat = (seat_uid: string) => {
    setSelectedSeats(prev =>
      prev.includes(seat_uid)
        ? prev.filter(s => s !== seat_uid)
        : [...prev, seat_uid]
    );
  };

const goToPayment = async () => {
  if (selectedSeats.length === 0) return;

  const res = await fetch(API_ENDPOINTS.paymentCreateSession, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: "test@example.com", 
      showtime_uid,
      seat_uids: selectedSeats,
      amount: selectedSeats.length * 1000, 
      currency: "eur",
    }),
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url; 
  } else {
    alert("Payment session error");
  }
};


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5">Select Seats</h2>

      <div className="seat-layout">
        {Object.keys(rows).map((row) => (
          <div key={row} className="seat-row">
            <div className="row-label">Row {row}</div>
            <div className="seat-row-items">
              {rows[row].map((seat: Seat) => {
                const isSelected = selectedSeats.includes(seat.seat_uid);

                return (
                  <button
                    key={seat.seat_uid}
                    disabled={seat.seat_status !== "free"}
                    onClick={() => toggleSeat(seat.seat_uid)}
                    className={`seat-btn seat-${seat.seat_status} ${
                      isSelected ? "seat-selected" : ""
                    }`}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      {selectedSeats.length > 0 && (
        <div className="selected-bar">
          <div>
            <strong>Selected Seats:</strong>{" "}
            {selectedSeats.length} seat(s)
          </div>
          <button className="btn btn-primary" onClick={goToPayment}>
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
}

export default SeatsPage;
