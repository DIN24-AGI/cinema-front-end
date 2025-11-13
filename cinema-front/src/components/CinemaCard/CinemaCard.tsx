import React from "react";
import { useTranslation } from "react-i18next";

interface CinemaCardProps {
	id: string;
	name: string;
	city: string;
	address: string;
	// phone: string;
	active: boolean;
	onToggleActive: (id: string, active: boolean) => void;
	onViewDetails: (id: string) => void;
}

const CinemaCard: React.FC<CinemaCardProps> = ({
	id,
	name,
	city,
	address,
	phone,
	active,
	onToggleActive,
	onViewDetails,
}) => {
	const { t } = useTranslation();
	return (
		<div className="card mb-3 shadow-sm">
			<div className="card-body">
				<h5 className="card-title d-flex justify-content-between align-items-start">
					<span>{name}</span>
					<span className={`badge ${active ? "bg-success" : "bg-secondary"}`}>
						{active ? t("util.active") : t("util.inactive")}
					</span>
				</h5>
				<ul className="list-group list-group-flush mb-3">
					<li className="list-group-item px-0">
            <strong>{t("cinemaCard.city")}: </strong>{city}
          </li>
					<li className="list-group-item px-0">
						<strong>{t("cinemaCard.address")}: </strong>
						{address}
					</li>
					{/* uncomment when added to the endpoint */}

					{/* <li className="list-group-item px-0">
						<strong>{t("cinemaCard.Phone")}: </strong>
						{phone}
					</li> */}

				</ul>
				<div className="d-flex gap-2">
					<button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onViewDetails(id)}>
						{t("util.viewDetails")}
					</button>
					<button
						type="button"
						className={`btn btn-sm ${active ? "btn-warning" : "btn-success"}`}
						onClick={() => onToggleActive(id, active)}
					>
						{active ? t("util.deactivate") : t("util.activate")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CinemaCard;
