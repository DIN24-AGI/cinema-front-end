import React from "react";
interface CinemaCardProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  hallsCount: number;
  active: boolean;
  onToggleActive: (id: string) => void;
  onViewDetails:  (id: string) => void;
}


const CinemaCard: React.FC<CinemaCardProps> = ({
  id,
  name,
  address,
  phone,
  hallsCount,
  active,
  onToggleActive,
  onViewDetails
}) => {
  return (
    <div>
      <h3>{name}</h3>
      <p><strong>Address: </strong>{address}</p>
      <p><strong>Phone: </strong>{phone}</p>
      <p><strong>Auditoriums: </strong>{hallsCount}</p>
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

export default CinemaCard;