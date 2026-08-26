import FavButton from "@/components/favButton/favButton";
import css from "./CollectionPage.module.css";
interface CollectionPageProps {
  type: "Reviews" | "History" | "Favorites";
}

export default function CollectionPage({ type }: CollectionPageProps) {
  const movies = [
    {
      id: "as",
      name: "Tokyo Train",
      year: "2022",
      genre: "Action comedy",
      image: "https://example.com/image.jpg",
    },
  ];
  return (
    <section className={css.section}>
      <h1 className={css.sectionTitle}>My {type.toLowerCase()}</h1>
      <ul className={css.movieList}>
        {movies.length &&
          movies.map((movie) => (
            <li
              className={css.movieItem}
              key={movie.id}
              style={{ backgroundImage: `url(${movie.image})` }}
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
