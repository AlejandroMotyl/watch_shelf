import Link from "next/link";
import css from "./page.module.css";
import Image from "next/image";

export default function ReviewsPage() {
  const reviews = [
    {
      id: "as",
      title: "Tokyo Train",
      year: "2022",
      genre: "Action comedy",
      image: "https://example.com/image.jpg",
      review: {
        author: "John Doe",
        rating: "8/10",
        text: "Tokyo Train is an unexpectedly fun ride from beginning to end. The action sequences are entertaining, while the comedy keeps the movie from taking itself too seriously. The characters are surprisingly enjoyable and the pacing stays strong throughout. Definitely worth watching if you're looking for something light and entertaining.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
    {
      id: "bb",
      title: "The Shawshank Redemption",
      year: "1994",
      genre: "Drama",
      image: "https://example.com/image.jpg",
      review: {
        author: "MovieFan92",
        rating: "10/10",
        text: "One of those rare movies that gets better every time you watch it. The performances are incredible, the story is emotional without feeling forced, and the ending is one of the most satisfying endings in cinema. A timeless classic.",
      },
    },
  ];

  return (
    <main className={css.reviewsPage}>
      <section className={css.reviewsSection}>
        <div className={css.pageHeader}>
          <h1 className={css.pageTitle}>Reviews</h1>
        </div>

        <ul className={css.reviewList}>
          {reviews.map((movie) => (
            <li className={css.reviewCard} key={movie.id}>
              <div className={css.movieImageWrapper}>
                <Image
                  className={css.movieImage}
                  // !!!!!!! src={movie.image}
                  src={"/images/auth-bg.jpg"}
                  alt={`${movie.title} poster`}
                  width={400}
                  height={600}
                />
              </div>

              <div className={css.reviewContent}>
                <div className={css.movieHeader}>
                  <div className={css.movieText}>
                    <h2 className={css.movieTitle}>{movie.title}</h2>

                    <p className={css.movieMeta}>
                      {movie.year} <span className={css.metaSeparator}>•</span>
                      {movie.genre}
                    </p>
                  </div>
                  <Link
                    className={css.movieLink}
                    href={`/catalogue/${movie.id}`}
                  >
                    View movie
                  </Link>
                </div>

                <div className={css.reviewBox}>
                  <div className={css.reviewHeader}>
                    <span className={css.reviewLabel}>Best review</span>

                    <span className={css.reviewRating}>
                      ★ {movie.review.rating}
                    </span>
                  </div>

                  <p className={css.reviewText}>{movie.review.text}</p>

                  <span className={css.reviewAuthor}>
                    — {movie.review.author}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
