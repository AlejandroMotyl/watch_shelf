import css from "./page.module.css";

export default function CatalogueIdPage() {
  return (
    <main className={css.moviePage}>
      <section className={css.movieCard}>
        <div className={css.movieHero}>
          <div className={css.posterWrapper}>
            <img
              className={css.poster}
              src="/placeholder-movie.jpg"
              alt="Movie poster"
            />
          </div>

          <div className={css.movieInfo}>
            <div className={css.movieHeader}>
              <span className={css.movieType}>Movie</span>

              <h1 className={css.movieTitle}>The Shawshank Redemption</h1>

              <p className={css.movieMeta}>
                1994 <span className={css.metaSeparator}>•</span> 2h 22m{" "}
                <span className={css.metaSeparator}>•</span> R
              </p>
            </div>

            <div className={css.rating}>
              <div className={css.ratingScore}>
                <span className={css.ratingValue}>9.3</span>
                <span className={css.ratingMax}>/10</span>
              </div>

              <div className={css.ratingInfo}>
                <span className={css.ratingLabel}>IMDb Rating</span>
                <span className={css.ratingVotes}>3.1M votes</span>
              </div>
            </div>

            <p className={css.movieDescription}>
              Two imprisoned men bond over a number of years, finding solace and
              eventual redemption through acts of common decency.
            </p>

            <div className={css.movieActions}>
              <button className={css.primaryButton} type="button">
                Watch now
              </button>

              <button className={css.secondaryButton} type="button">
                + Add to watchlist
              </button>
            </div>
          </div>
        </div>

        {/* Movie details */}
        <section className={css.detailsSection}>
          <h2 className={css.sectionTitle}>Details</h2>

          <div className={css.detailsGrid}>
            <div className={css.detailItem}>
              <span className={css.detailLabel}>Director</span>
              <span className={css.detailValue}>Frank Darabont</span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Writers</span>
              <span className={css.detailValue}>
                Stephen King, Frank Darabont
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Stars</span>
              <span className={css.detailValue}>
                Tim Robbins, Morgan Freeman, Bob Gunton
              </span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Genres</span>
              <span className={css.detailValue}>Drama</span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Release date</span>
              <span className={css.detailValue}>September 23, 1994</span>
            </div>

            <div className={css.detailItem}>
              <span className={css.detailLabel}>Country</span>
              <span className={css.detailValue}>United States</span>
            </div>
          </div>
        </section>

        <section className={css.imdbSection}>
          <div className={css.imdbHeader}>
            <span className={css.imdbBadge}>IMDb</span>

            <div className={css.imdbInfo}>
              <span className={css.imdbTitle}>IMDb rating</span>
              <span className={css.imdbSubtitle}>
                Based on 3.1M user ratings
              </span>
            </div>

            <div className={css.imdbRating}>
              <span className={css.imdbScore}>9.3</span>
              <span className={css.imdbMax}>/10</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
