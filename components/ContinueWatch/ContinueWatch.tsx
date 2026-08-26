import css from "./ContinueWatch.module.css";
import FavButton from "../favButton/favButton";

export default function ContinueWatch() {
  const conWatchList = [
    {
      id: "as",
      name: "Tokyo Train",
      year: "2022",
      genre: "Action comedy",
      image: "https://example.com/image.jpg",
    },
  ];
  return (
    <section className={css.conWatchSection}>
      <h2 className={css.title}>Continue watching</h2>
      <ul className={css.conWatchList}>
        {conWatchList.length &&
          conWatchList.map((movie) => (
            <li
              className={css.conWatchItem}
              key={movie.id}
              style={{ backgroundImage: `url(${movie.image})` }}
            >
              <FavButton size="small" />
              <div className={css.titleWrapper}>
                <h3 className={css.movieTitle}>{movie.name}</h3>
                <p className={css.description}>
                  {movie.year} | {movie.genre}
                </p>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
