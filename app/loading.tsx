import css from "./loading.module.css";

export default function Loading() {
  return (
    <div className={css.loading}>
      <svg className={css.logo} aria-label="Loading" role="img">
        <use href="/sprite.svg#logo" />
      </svg>
    </div>
  );
}
