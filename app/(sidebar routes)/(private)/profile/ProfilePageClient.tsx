"use client";
import Image from "next/image";
import css from "./page.module.css";
import { useAuthStore } from "@/lib/store/authStore/authStore";

export default function ProfilePageClient() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className={css.profilePage}>
      <section className={css.profileCard}>
        <div className={css.profileHeader}>
          <h1 className={css.profileTitle}>Profile</h1>
          <p className={css.profileDescription}>
            Manage your account information and preferences.
          </p>
        </div>

        <section className={css.profileSection}>
          <h2 className={css.sectionTitle}>Profile picture</h2>

          <div className={css.avatarRow}>
            <Image
              className={css.avatar}
              src={user.avatar_url ?? "/images/placeholder.jpeg"}
              alt="userImage"
              width={32}
              height={32}
            />

            <div className={css.avatarActions}>
              <label className={css.uploadButton}>
                Change picture
                <input className={css.fileInput} type="file" accept="image/*" />
              </label>

              <button className={css.removeButton} type="button">
                Remove
              </button>
            </div>
          </div>
        </section>

        <section className={css.profileSection}>
          <h2 className={css.sectionTitle}>Personal information</h2>

          <form className={css.form}>
            <label className={css.inputGroup}>
              <span className={css.inputLabel}>{user?.username}</span>
              <input
                className={css.formInput}
                type="text"
                defaultValue={user.username}
                placeholder="Your name"
              />
            </label>

            <label className={css.inputGroup}>
              <span className={css.inputLabel}>Email</span>
              <input
                className={css.formInput}
                type="email"
                defaultValue={user.email}
                disabled
              />
              <small className={css.inputHint}>
                Email address cannot be changed.
              </small>
            </label>

            <button className={css.primaryButton} type="submit">
              Save changes
            </button>
          </form>
        </section>

        <section className={css.profileSection}>
          <h2 className={css.sectionTitle}>Password</h2>

          <p className={css.sectionDescription}>
            Change your password to keep your account secure.
          </p>

          <form className={css.form}>
            <label className={css.inputGroup}>
              <span className={css.inputLabel}>Current password</span>
              <input
                className={css.formInput}
                type="password"
                placeholder="Current password"
              />
            </label>

            <label className={css.inputGroup}>
              <span className={css.inputLabel}>New password</span>
              <input
                className={css.formInput}
                type="password"
                placeholder="New password"
              />
            </label>

            <label className={css.inputGroup}>
              <span className={css.inputLabel}>Repeat new password</span>
              <input
                className={css.formInput}
                type="password"
                placeholder="Repeat new password"
              />
            </label>

            <button className={css.primaryButton} type="submit">
              Change password
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
