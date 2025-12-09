import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

function Cinemas() {
  const { t } = useTranslation();
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.cinemas);
      const data = await res.json();
      setCinemas(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>{t("util.loading")}</p>;

  return (
    <div className="container mt-4">
      <h2>{t("cinemas.title")}</h2>
      {cinemas.map((c) => (
        <div key={c.uid} className="card p-3 my-2 shadow-sm">
          <h5>{c.name}</h5>
          <p>{c.address}</p>
        </div>
      ))}
    </div>
  );
}

export default Cinemas;
