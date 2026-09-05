"use client";

import Image from "next/image";
import css from "./Header.module.css";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { showError } from "@/utils/iziToast";
import { usePathname } from "next/navigation";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";
import { logout } from "@/lib/api/clientApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { filter, setFilter } = useMediaFilterStore();
  const { isAuthenticated, clearIsAuthenticated, user } = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  // ??? no scroll when a mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ?? CLICK OUTSIDE MENU\
  const userMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ??? LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      closeMenu();
      router.push("/catalogue");
    } catch {
      await showError("Log out failed, try again");
    }
  };

  return (
    <header className={css.header}>
      {pathname !== "/profile" && !pathname.startsWith("/catalogue/") && (
        <div className={css.filters}>
          <button
            className={`${css.filterButton} ${filter === "movie" ? css.active : ""}`}
            type="button"
            onClick={() => setFilter("movie")}
            disabled={filter === "movie"}
          >
            Movies
          </button>
          <button
            className={`${css.filterButton} ${filter === "tv" ? css.active : ""}`}
            type="button"
            onClick={() => setFilter("tv")}
            disabled={filter === "tv"}
          >
            Series
          </button>
          <button
            className={`${css.filterButton} ${filter === "people" ? css.active : ""}`}
            type="button"
            onClick={() => setFilter("people")}
            disabled={filter === "people"}
          >
            People
          </button>
        </div>
      )}
      {!isAuthenticated ? (
        <div className={css.authLinksWrapper}>
          <Link href={"/auth/login"} className={css.authLink}>
            Login
          </Link>
          <Link
            href={"/auth/register"}
            className={`${css.authLink} ${css.registerLink}`}
          >
            Register
          </Link>
        </div>
      ) : (
        isAuthenticated &&
        user && (
          <div className={css.userButtons} ref={userMenuRef}>
            <button className={css.userButton}>
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#search" />
              </svg>
            </button>
            {/* <button className={css.userButton}>
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#bell" />
              </svg>
            </button> */}
            <button
              className={css.headerProfile}
              type="button"
              onClick={toggleMenu}
            >
              <Image
                className={css.profileImage}
                src={user.avatar_url ?? "/images/placeholder.jpeg"}
                alt="userImage"
                width={32}
                height={32}
              />
              <span>
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </span>
            </button>

            <div
              className={`${css.userModal}  ${isMenuOpen ? css.menuOpen : ""}`}
            >
              <Link href="/profile" className={css.profileLink}>
                Settings
              </Link>

              <button
                onClick={handleLogout}
                type="button"
                className={css.logoutButton}
              >
                Logout
              </button>
            </div>
          </div>
        )
      )}
    </header>
  );
}
