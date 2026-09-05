"use client";

import Image from "next/image";
import css from "./Header.module.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { showError } from "@/utils/iziToast";
import { usePathname } from "next/navigation";
import { useMediaFilterStore } from "@/lib/store/mediaFilterStore/mediaFilterStore";
import { useQuery } from "@tanstack/react-query";
import { logout } from "@/lib/api/clientApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { filter, setFilter } = useMediaFilterStore();
  const { isAuthenticated, clearIsAuthenticated, user } = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // const handleLogoutClick = () => {
  //   setIsModalOpen(true);
  // };

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
        <Link href={"/auth/login"}> Login</Link>
      ) : (
        isAuthenticated &&
        user && (
          <div className={css.userButtons}>
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
                src={user.avatar_url}
                alt="userImage"
                width={32}
                height={32}
              />
              <span>
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </span>
            </button>

            {isModalOpen && (
              <div className={css.userModal}>
                <Link href={"/profile"} className={css.profileLink}>
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
            )}
          </div>
        )
      )}
    </header>
  );
}
