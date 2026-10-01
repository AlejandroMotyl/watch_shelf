import css from "./FetchError.module.css";

interface FetchErrorProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
}

export default function FetchError({
  title = "Something went wrong.",
  message,
  onRetry,
}: FetchErrorProps) {
  return (
    <div className={css.errorState}>
      <h2>{title}</h2>

      {message && <p>{message}</p>}

      {onRetry && (
        <button type="button" className={css.retryButton} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
