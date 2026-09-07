import css from "./UserPasswordForm.module.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/api/clientApi";

export default function UserPasswordForm() {
  const [error, setError] = useState<string>("");

  const { mutate: updatePasswordMutation, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      setError("");
    },
    onError: () => {
      setError("Failed to update the password");
    },
  });

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const newPasswordRepeat = formData.get("newPasswordRepeat") as string;

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !newPasswordRepeat.trim()
    ) {
      setError("Make sure to fill all the fields");
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      setError("New passwords do not match");
      return;
    }
    updatePasswordMutation({ currentPassword, newPassword });
  };

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <label className={css.inputGroup}>
        <span className={css.inputLabel}>Current password</span>
        <input
          className={css.formInput}
          type="password"
          placeholder="Current password"
          name="currentPassword"
        />
      </label>

      <label className={css.inputGroup}>
        <span className={css.inputLabel}>New password</span>
        <input
          className={css.formInput}
          type="password"
          placeholder="New password"
          name="newPassword"
        />
      </label>

      <label className={css.inputGroup}>
        <span className={css.inputLabel}>Repeat new password</span>
        <input
          className={css.formInput}
          type="password"
          placeholder="Repeat new password"
          name="newPasswordRepeat"
        />
      </label>
      {error && <p className={css.error}>{error}</p>}
      <button className={css.primaryButton} type="submit" disabled={isPending}>
        {isPending ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
