import { useAuthStore } from "@/lib/store/authStore/authStore";
import css from "./UsernameForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { updateUsername } from "@/lib/api/clientApi";
import { useState } from "react";

export default function UsernameForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>("");

  const { mutate: updateUsernameMutation, isPending } = useMutation({
    mutationFn: updateUsername,
    onSuccess: (data) => {
      setUser(data.user);
      setError("");
    },
    onError: () => {
      setError("Failed to update the username");
    },
  });

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;

    if (!username.trim().length) {
      setError("Make sure to write the name");
      return;
    }
    updateUsernameMutation(username);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <label className={css.inputGroup}>
        <span className={css.inputLabel}>{user?.username}</span>
        <input
          className={css.formInput}
          type="text"
          defaultValue={user.username}
          placeholder="Your name"
          name="username"
        />
      </label>

      <label className={css.inputGroup}>
        <span className={css.inputLabel}>Email</span>
        <input
          className={css.formInput}
          type="email"
          name="email"
          defaultValue={user.email}
          disabled
        />
        <small className={css.inputHint}>
          Email address cannot be changed.
        </small>
      </label>
      {error && <p className={css.error}>{error}</p>}
      <button className={css.primaryButton} type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
