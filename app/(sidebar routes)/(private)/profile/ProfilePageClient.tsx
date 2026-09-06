"use client";
import Image from "next/image";
import css from "./page.module.css";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { useState } from "react";
import { updateAvatar } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/user";

export default function ProfilePageClient() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const {
    data,
    mutate: updateAvatarMutation,
    isPending,
  } = useMutation({
    mutationFn: updateAvatar,
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: () => {
      setError("Failed to update avatar");
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only images");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => setPreviewUrl("");

  const handleSaveChanges = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      return;
    }
    updateAvatarMutation(selectedFile);
  };

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

          <form className={css.avatarForm} onSubmit={handleSaveChanges}>
            <Image
              className={css.avatar}
              src={previewUrl || user.avatar_url || "/images/placeholder.jpeg"}
              alt="Profile picture"
              width={100}
              height={100}
            />

            <div className={css.avatarActions}>
              <label className={css.uploadButton}>
                Change picture
                <input
                  className={css.fileInput}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <button
                className={css.saveButton}
                type="submit"
                disabled={!selectedFile || isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>

              <button
                className={css.removeButton}
                type="button"
                onClick={handleRemoveAvatar}
              >
                Remove
              </button>
            </div>

            {error && <p className={css.error}>{error}</p>}
          </form>
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
