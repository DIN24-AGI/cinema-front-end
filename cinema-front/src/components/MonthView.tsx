import React, { useState, useEffect } from "react";

interface Movie {
  uid: string;
  title: string;
  showtimes: string[];
}

interface DaySchedule {
  date: string;
  movies: Movie[];
}

interface MonthViewProps {
  hallUid: string;
  month: string; 
}

const MonthView: React.FC<MonthViewProps> = ({ hallUid, month }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        //Correct once we have backend for that
        const res = await fetch(`/api/halls/${hallUid}/schedule?month=${month}`);
        if (!res.ok) throw new Error("Failed to load schedule");
        const data: DaySchedule[] = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [hallUid, month]);

  const firstDay = new Date(month + "-01").getDay();
  const numDays = new Date(Number(month.split("-")[0]), Number(month.split("-")[1]), 0).getDate();

  const handleClickDay = (day: string) => {
    const daySchedule = schedule.find((d) => d.date === day);
    setSelectedDay(daySchedule || { date: day, movies: [] });
  };

  const getMoviesForDay = (day: number) => {
    const dayStr = `${month}-${day.toString().padStart(2, "0")}`;
    const daySchedule = schedule.find((d) => d.date === dayStr);
    return daySchedule?.movies || [];
  };

  return (
    <div>
      <h3>Month View - {month}</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={"empty" + idx}></div>
            ))}
            {Array.from({ length: numDays }).map((_, idx) => {
              const day = idx + 1;
              const movies = getMoviesForDay(day);
              return (
                <div
                  key={day}
                  style={{
                    border: "1px solid #ccc",
                    padding: 4,
                    cursor: "pointer",
                    background: movies.length > 0 ? "#e6f7ff" : "#fff",
                  }}
                  onClick={() => handleClickDay(`${month}-${day.toString().padStart(2, "0")}`)}
                >
                  <strong>{day}</strong>
                  {movies.length > 0 && <div style={{ fontSize: 10 }}>{movies.length} movies</div>}
                </div>
              );
            })}
          </div>

          {selectedDay && (
            <div style={{ marginTop: 16, padding: 8, border: "1px solid #ddd" }}>
              <h4>Schedule for {selectedDay.date}</h4>
              {selectedDay.movies.length === 0 ? (
                <p>No movies scheduled</p>
              ) : (
                <ul>
                  {selectedDay.movies.map((m) => (
                    <li key={m.uid}>
                      <strong>{m.title}</strong>: {m.showtimes.join(", ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonthView;
