import Sidebar from "@/components/Sidebar/Sidebar";
import css from "./layout.module.css";
import Header from "@/components/Header/Header";
import Container from "@/components/Container/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Watch Shelf",
    template: "%s | Watch Shelf",
  },
  description:
    "Discover movies and TV shows, save your favorites, rate and review what you watch, and keep track of your watch history.",
  openGraph: {
    title: "Watch Shelf",
    description:
      "Discover movies and TV shows, save your favorites, rate and review what you watch, and keep track of your watch history.",
    images: [
      {
        url: "/images/auth-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Watch Shelf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Shelf",
    description:
      "Discover movies and TV shows, save your favorites, rate and review what you watch, and keep track of your watch history.",
    images: ["/images/auth-bg.jpg"],
  },
};

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <div className={css.layout}>
        <div className={css.sidebarWrap}>
          <Sidebar />
        </div>
        <main className={css.main}>
          <Header />
          {children}
        </main>
      </div>
    </Container>
  );
};

export default LayoutClient;
