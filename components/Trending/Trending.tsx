import FavButton from "../favButton/favButton";
import css from "./Trending.module.css";

export default function Trending() {
  const trending = [
    {
      id: "as",
      name: "Tokyo Train",
      year: "2022",
      genre: "Action comedy",
      image: "https://example.com/image.jpg",
    },
  ];
  return (
    <section className={css.trendingSection}>
      <h2 className={css.title}>Trending</h2>
      <ul className={css.trendingList}>
        {trending.length &&
          trending.map((movie) => (
            <li
              className={css.trendingItem}
              key={movie.id}
              style={{ backgroundImage: `linear-gradient(url(${movie.image})` }}
            >
              <FavButton size={"small"} />
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
