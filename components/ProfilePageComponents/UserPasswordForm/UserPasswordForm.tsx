import css from "./UserPasswordForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/api/clientApi";
import { showError, showMessage } from "@/utils/iziToast";
import { isAxiosError } from "axios";

export default function UserPasswordForm() {
  const { mutate: updatePasswordMutation, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      showMessage("Successfully changed your password!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        showError(
          error.response?.data?.response?.validation?.body?.message ??
            "Failed to update the password",
        );
      } else {
        showError("Failed to update the password");
      }
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
      showError("Make sure to fill all the fields");
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      showError("New passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      showError("New password must be different from current password");
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
      <button className={css.primaryButton} type="submit" disabled={isPending}>
        {isPending ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
