import Link from "next/link";
import css from "./layout.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Authentication",
    template: "%s | Watch Shelf",
  },
  description: "Log in or create your Watch Shelf account.",
  openGraph: {
    title: "Watch Shelf",
    description: "Discover and track movies and TV shows.",
    images: [
      {
        url: "/images/auth-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Watch Shelf",
      },
    ],
  },
};

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css.layout}>
      <main className={css.main}>
        <div className={css.container}>
          <Link className={css.logo} href="/catalogue">
            <svg className={css.icon} width="32" height="32" aria-hidden="true">
              <use href="/sprite.svg#logo" />
            </svg>
            <span>WATCH</span>
          </Link>

          <h1 className={css.title}>Enjoy the newest movies</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutClient;
