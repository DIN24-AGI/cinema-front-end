import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Cinema, City } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const AddCinema: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const existingCinema = location.state?.cinema as Cinema | undefined;

	const [name, setName] = useState(existingCinema?.name || "");
	const [address, setAddress] = useState(existingCinema?.address || "");
	const [phone, setPhone] = useState(existingCinema?.phone || "");
	const [cityUid, setCityUid] = useState(existingCinema?.city_uid || "");
	const [cities, setCities] = useState<City[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	 useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_ENDPOINTS.cities, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load cities");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
        setError("Could not load cities. Please try again.");
      }
    };

    fetchCities();
  }, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const token = localStorage.getItem("token");
		if (!token) {
			setError("No token found. Please log in.");
			setLoading(false);
			return;
		}

		try {
			const body = { city_uid: cityUid, name, address, phone };

			const res = await fetch(
				existingCinema ? `${API_ENDPOINTS.cinemas}/${existingCinema.uid}` : API_ENDPOINTS.cinemas,
				{
					method: existingCinema ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(body),
				}
			);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.msg || "Failed to save cinema");
			}

			const savedCinema = await res.json();
			console.log("Saved cinema:", savedCinema);

			navigate("/admin/cinemas");
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<h2 className="mb-4">{existingCinema ? t("cinemas.editCinema") : t("cinemas.addCinema")}</h2>

			{error && <div className="alert alert-danger">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="mb-3">
          <label className="form-label">{t("cinemas.city")}</label>
          <select
            className="form-select"
            value={cityUid}
						disabled={!!existingCinema}
            onChange={(e) => setCityUid(e.target.value)}
            required
          >
            <option value="">{t("util.selectCity")}</option>
            {cities.map((city) => (
              <option key={city.uid} value={city.uid}>
                {city.name}
              </option>
            ))}
          </select>
					  {existingCinema && (
    			<small className="text-muted">{t("cinemas.cityCannotBeChanged")}</small>
  				)}
        </div>
				<div className="mb-3">
					<label className="form-label">{t("cinemas.name")}</label>
					<input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>

				<div className="mb-3">
					<label className="form-label">{t("cinemas.address")}</label>
					<input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
				</div>

				<div className="mb-3">
					<label className="form-label">{t("cinemas.phone")}</label>
					<input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
				</div>

				<button type="submit" className="btn btn-primary" disabled={loading}>
					{loading ? t("util.saving") : existingCinema ? t("cinemas.updateCinema") : t("cinemas.addCinema")}
				</button>
				<button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/admin/cinemas")}>
					{t("util.cancel")}
				</button>
			</form>
		</div>
	);
};

export default AddCinema;
