"use client";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import css from "./page.module.css";
import UserAvatarForm from "@/components/ProfilePageComponents/UserAvatarForm/UserAvatarForm";
import UsernameForm from "@/components/ProfilePageComponents/UsernameForm/UsernameForm";
import UserPasswordForm from "@/components/ProfilePageComponents/UserPasswordForm/UserPasswordForm";
import Loading from "@/components/Loading/Loading";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Loading size="large" />;
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
          <UserAvatarForm />
        </section>

        <section className={css.profileSection}>
          <h2 className={css.sectionTitle}>Personal information</h2>

          <UsernameForm />
        </section>

        <section className={css.profileSection}>
          <h2 className={css.sectionTitle}>Password</h2>

          <p className={css.sectionDescription}>
            Change your password to keep your account secure.
          </p>
          <UserPasswordForm />
        </section>
      </section>
    </main>
  );
}
