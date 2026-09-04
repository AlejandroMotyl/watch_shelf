import Link from "next/link";
import css from "./Sidebar.module.css";
import { useAuthStore } from "@/lib/store/authStore/authStore";

export default function Sidebar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <aside className={css.sidebarWrapper}>
      <Link className={css.logo} href="/catalogue">
        <svg className={css.icon} width="32" height="32" aria-hidden="true">
          <use href="/sprite.svg#logo" />
        </svg>
        <span>WATCH</span>
      </Link>

      <nav className={css.navMenu}>
        <ul className={css.moviesNav}>
          <li className={css.navItem}>
            <Link className={css.navLink} href="/catalogue">
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#film" />
              </svg>
              <span>Home</span>
            </Link>
          </li>

          <li className={css.navItem}>
            <Link className={css.navLink} href="/reviews">
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#message-circle" />
              </svg>
              <span>Reviews</span>
            </Link>
          </li>

          {/* <li className={css.navItem}>
            <Link className={css.navLink} href="/trending">
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#trending-up" />
              </svg>
              <span>Trending</span>
            </Link>
          </li>

          <li className={css.navItem}>
            <Link className={css.navLink} href="/favorites">
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#heart" />
              </svg>
              <span>Favorites</span>
            </Link>
          </li> */}
        </ul>

        {isAuthenticated ? (
          <>
            <ul className={css.userCatalogue}>
              <li className={css.navItem}>
                <Link className={css.navLink} href="/profile/favorites">
                  <svg className={css.icon} aria-hidden="true">
                    <use href="/sprite.svg#heart" />
                  </svg>
                  <span>My Favorites</span>
                </Link>
              </li>
              <li className={css.navItem}>
                <Link className={css.navLink} href="/profile/reviews">
                  <svg className={css.icon} aria-hidden="true">
                    <use href="/sprite.svg#message-circle" />
                  </svg>
                  <span>My Reviews</span>
                </Link>
              </li>
              <li className={css.navItem}>
                <Link className={css.navLink} href="/profile/watched">
                  <svg className={css.icon} aria-hidden="true">
                    <use href="/sprite.svg#film" />
                  </svg>
                  <span>My History</span>
                </Link>
              </li>
            </ul>
            <ul className={css.navProfile}>
              <li className={css.navItem}>
                <Link className={css.navLink} href="/profile">
                  <svg className={css.icon} aria-hidden="true">
                    <use href="/sprite.svg#users" />
                  </svg>
                  <span>Profile</span>
                </Link>
              </li>

              {/* <li className={css.navItem}>
            <Link className={css.navLink} href="/settings">
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#sliders" />
              </svg>
              <span>Settings</span>
            </Link>
          </li> */}

              <li className={css.navItem}>
                <button type="button" className={css.navLink}>
                  <svg className={css.icon} aria-hidden="true">
                    <use href="/sprite.svg#log-out" />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </>
        ) : (
          <>
            <div className={css.authNav}>
              <svg className={css.icon} aria-hidden="true">
                <use href="/sprite.svg#users" />
              </svg>
              <ul className={css.authLinks}>
                <li className={css.navItem}>
                  <Link className={css.navLink} href="auth/login">
                    <span>Login</span>
                  </Link>
                </li>
                <li className={css.navItem}>
                  <Link className={css.navLink} href="auth/register">
                    <span>Register</span>
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
