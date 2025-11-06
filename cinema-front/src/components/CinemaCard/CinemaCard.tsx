import React from "react";
interface TheaterCardProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  auditoriumsCount: number;
  active: boolean;
  onToggleActive: (id: string) => void;
  onViewDetails:  (id: string) => void;
}


const TheaterCard: React.FC<TheaterCardProps> = ({
  id,
  name,
  address,
  phone,
  auditoriumsCount,
  active,
  onToggleActive,
  onViewDetails
}) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{address}</p>
      <p>{phone}</p>
      <p>Auditoriums: {auditoriumsCount}</p>
      <div>
         <button
            onClick={() => onViewDetails(id)}
            >
            View Details
        </button>
        <button onClick={() => onToggleActive(id)}>
          {active ? "Deactivate" : "Activate"}
        </button>   

      </div>
    </div>
  );
};

export default TheaterCard;