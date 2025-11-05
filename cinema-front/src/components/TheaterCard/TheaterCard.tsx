import React from "react";
interface TheaterCardProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  auditoriumsCount: number;
  active: boolean;
  onToggleActive: (id: string) => void;
  onManageAuditoriums: (id: string) => void;
}

const TheaterCard: React.FC<TheaterCardProps> = ({
  id,
  name,
  address,
  phone,
  auditoriumsCount,
  active,
  onToggleActive,
  onManageAuditoriums,
}) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{address}</p>
      <p>{phone}</p>
      <p>Auditoriums: {auditoriumsCount}</p>
      <div>
        <button onClick={() => onToggleActive(id)}>
          {active ? "Deactivate" : "Activate"}
        </button>
        <button onClick={() => onManageAuditoriums(id)}>
          Manage Auditoriums
        </button>
      </div>
    </div>
  );
};

export default TheaterCard;