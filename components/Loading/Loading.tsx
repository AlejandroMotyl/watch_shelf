import css from "./Loading.module.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  label?: string;
}

export default function Loading({
  size = "medium",
  label = "Loading",
}: LoadingProps) {
  return (
    <div
      className={`${css.loader} ${css[size]}`}
      role="status"
      aria-label={label}
    >
      <span className={css.dot} />
      <span className={css.dot} />
      <span className={css.dot} />
    </div>
  );
}
