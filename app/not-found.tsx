import type { Metadata } from "next";
import Link from "next/link";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | Watch Shelf",
  description: "The page you&apos;re looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className={css.notFoundPage}>
      <section className={css.notFoundCard}>
        <div className={css.errorCode} aria-hidden="true">
          404
        </div>

        <div className={css.content}>
          <span className={css.eyebrow}>PAGE NOT FOUND</span>

          <h1 className={css.title}>
            Looks like this page
            <br />
            left the shelf.
          </h1>

          <p className={css.description}>
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back to your movies and shows.
          </p>

          <Link href="/" className={css.backButton}>
            <span className={css.arrow} aria-hidden="true">
              ←
            </span>
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
