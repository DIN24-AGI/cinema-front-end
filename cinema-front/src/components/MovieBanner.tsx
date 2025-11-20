import type { Movie } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";


interface MovieBannerProps extends Movie {
  onDetails?: () => void;
}

const MovieBanner = ( {
  uid,
  title,
  duration_minutes,
  poster_url,
  release_year,
  active, } : MovieBannerProps
) => {
  const { t } = useTranslation();

  return (
<div className="w-48 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* Poster */}
      <img
        src={poster_url}
        alt={title}
        className="w-full h-64 object-cover"
      />

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

        {/* Duration + Year */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>{duration_minutes} min</span>
          <span>{release_year}</span>
        </div>

        {/* Button */}
        <button
          onClick={onDetails}
          className="mt-auto w-full bg-blue-600 text-white py-1.5 rounded-xl text-sm hover:bg-blue-700 transition"
        >
          View details
        </button>
      </div>
    </div>
  )

}

export default MovieBanner
