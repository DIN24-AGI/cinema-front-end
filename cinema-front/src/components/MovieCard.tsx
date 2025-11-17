/**
 * MovieCard
 * Admin-facing card component that displays a single movie and its metadata.
 *
 * Responsibilities:
 * - Show poster, title + release year, description and show progress
 * - Indicate current active/inactive status
 * - Expose optional action handlers (edit, delete, toggle active)
 * - Use i18n for all user-facing labels
 */
import type { Movie as MovieDTO } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";

/**
 * Props extend the Movie domain type with optional callbacks for actions.
 * If a callback is not provided, its corresponding button is not rendered.
 */
interface MovieCardProps extends MovieDTO {
  onEdit?: (uid: string) => void;
  onDelete?: (uid: string) => void;
  onToggle?: (uid: string, nextActive: boolean) => void;
}

const MovieCard = ({
  uid,
  title,
  duration_minutes,
  description,
  poster_url,
  release_year,
  shows_allowed,
  shows_left,
  active,
  onEdit,
  onDelete,
  onToggle,
}: MovieCardProps) => {
  const { t } = useTranslation();
  // Defensive bounds for show progress. We ensure values are non-negative
  // and that "left" cannot exceed "allowed" to keep UI sane.
  const safeAllowed = Math.max(0, shows_allowed);
  const safeLeft = Math.max(0, Math.min(shows_left, safeAllowed));
  // Percent of scheduled shows used: (allowed - left) / allowed
  const progressPercent =
    safeAllowed > 0
      ? Math.round(((safeAllowed - safeLeft) / safeAllowed) * 100)
      : 0;

  return (
    <div className="card shadow-sm">
      <div className="row g-0">
        {/* Left: Poster (or placeholder) */}
        <div className="col-12 col-sm-4 col-md-3">
          {poster_url ? (
            <img
              src={poster_url}
              alt={`${title} poster`}
              className="img-fluid rounded-start h-100 object-fit-cover w-100"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light text-muted rounded-start h-100">
              {t("movies.noPoster")}
            </div>
          )}
        </div>
        {/* Right: Movie details, status badge, progress and actions */}
        <div className="col-12 col-sm-8 col-md-9">
          <div className="card-body">
            <div className="d-flex align-items-start gap-2">
              <h5 className="card-title mb-1">
                {title} <small className="text-muted">({release_year})</small>
              </h5>
              {/* Status badge floats to the end */}
              <span
                className={`badge ms-auto ${
                  active ? "bg-success" : "bg-secondary"
                }`}
              >
                {active ? t("util.active") : t("util.inactive")}
              </span>
            </div>

            {/* Duration (localized minutes format) */}
            <p className="card-text text-muted mb-2">
              {t("movies.duration", { minutes: duration_minutes })}
            </p>

            {/* Description supports newlines (whiteSpace: pre-line) */}
            <p className="card-text mb-3" style={{ whiteSpace: "pre-line" }}>
              {description}
            </p>

            {/* Shows info + remaining count */}
            <div className="d-flex align-items-center gap-2 mb-1">
              <strong>{t("movies.shows")}:</strong>
              <span>
                {safeAllowed - safeLeft}/{safeAllowed} {t("movies.scheduled")}
              </span>
              <span className="ms-auto text-nowrap">
                {t("movies.left")}: {safeLeft}
              </span>
            </div>
            {/* Visual progress bar for scheduled shows usage */}
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Action buttons: only render those with provided callbacks */}
            {(onEdit || onDelete || onToggle) && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {/* Activate/Deactivate toggle */}
                {onToggle && (
                  <button
                    className={`btn btn-sm ${
                      active ? "btn-outline-secondary" : "btn-outline-success"
                    }`}
                    onClick={() => onToggle(uid, !active)}
                  >
                    {active ? t("util.deactivate") : t("util.activate")}
                  </button>
                )}
                {/* Edit opens the movie edit form */}
                {onEdit && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(uid)}
                  >
                    {t("util.edit")}
                  </button>
                )}
                {/* Delete removes the movie after confirmation upstream */}
                {onDelete && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(uid)}
                  >
                    {t("util.delete")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
