import Link from "next/link";
import css from "./Hero.module.css";
import FavButton from "../favButton/favButton";

export default function Hero() {
  return (
    <section
      className={css.heroSection}
      style={{
        backgroundImage: `
    linear-gradient(
      to bottom,
      transparent 40%,
      var(--background) 100%
    ),
    url("https://example.com/image.jpg")
  `,
      }}
    >
      <div className={css.titleWrapper}>
        <h1 className={css.title}>Insider</h1>
        <p className={css.description}> 2022 | Comedy horror | 1 Season</p>
      </div>
      <div className={css.buttonsWrapper}>
        <Link href="/catalogue" className={css.watchLink}>
          Watch now
        </Link>
        <FavButton size="big" />
      </div>
    </section>
  );
}
