import css from "./FetchError.module.css";

interface FetchErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function FetchError({
  message = "Something went wrong while loading this content.",
  onRetry,
}: FetchErrorProps) {
  return (
    <div className={css.errorState}>
      <h2>Something went wrong</h2>

      <p>{message}</p>

      {onRetry && (
        <button type="button" className={css.retryButton} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
