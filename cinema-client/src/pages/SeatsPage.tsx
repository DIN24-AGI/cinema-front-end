import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

type Seat = {
  seat_uid: string;
  row: number;
  number: number;
  seat_status: "free" | "reserved" | "paid" | "blocked" | "sold";
};

function SeatsPage() {
  const { showtime_uid } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // ----------------------------------------------------
  // 1) Load initial seats
  // ----------------------------------------------------
  useEffect(() => {
    if (!showtime_uid) return;

    const loadSeats = async () => {
      const res = await fetch(`${API_ENDPOINTS.seats}?showtime_uid=${showtime_uid}`);
      const data = await res.json();
      setSeats(data);
    };

    loadSeats();
  }, [showtime_uid]);

  // ----------------------------------------------------
  // 2) Live WebSocket seat updates
  // ----------------------------------------------------
  useEffect(() => {
    if (!showtime_uid) return;

    // Convert backend HTTP URL → ws:// or wss://
    const WS_URL =
      API_ENDPOINTS.base.replace("http", "ws") +
      `/ws/seats?showtime_uid=${showtime_uid}`;

    console.log("Connecting seats WS:", WS_URL);

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("[WS] seats connected");
    ws.onclose = () => console.log("[WS] seats disconnected");
    ws.onerror = (e) => console.error("[WS] error:", e);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type !== "seat_update") return;

      const { seat_uid, status } = msg;

      console.log("[WS] Seat update:", msg);

      // Update seat status in UI
      setSeats((prev) =>
        prev.map((s) =>
          s.seat_uid === seat_uid ? { ...s, seat_status: status } : s
        )
      );

      // If seat becomes reserved/paid, remove from local selection
      if (status !== "free") {
        setSelectedSeats((prev) => prev.filter((id) => id !== seat_uid));
      }
    };

    return () => ws.close();
  }, [showtime_uid]);

  // ----------------------------------------------------
  // Group seats by row
  // ----------------------------------------------------
  const rows = seats.reduce((acc: any, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // ----------------------------------------------------
  // Handle seat selection (only free seats)
  // ----------------------------------------------------
  const toggleSeat = (seat_uid: string) => {
    const seat = seats.find((s) => s.seat_uid === seat_uid);
    if (!seat || seat.seat_status !== "free") return;

    setSelectedSeats((prev) =>
      prev.includes(seat_uid)
        ? prev.filter((s) => s !== seat_uid)
        : [...prev, seat_uid]
    );
  };

  // ----------------------------------------------------
  // Go to payment
  // ----------------------------------------------------
  const goToPayment = async () => {
    if (selectedSeats.length === 0) return;

    const res = await fetch(API_ENDPOINTS.paymentCreateSession, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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

  // ----------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------
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

      {selectedSeats.length > 0 && (
        <div className="selected-bar">
          <div>
            <strong>Selected Seats: </strong>
            {selectedSeats.length}
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
