"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import css from "./UserPasswordForm.module.css";
import { updatePassword } from "@/lib/api/clientApi";
import { showError, showMessage } from "@/utils/iziToast";

export default function UserPasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordRepeat, setShowNewPasswordRepeat] = useState(false);

  const { mutate: updatePasswordMutation, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      formRef.current?.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowNewPasswordRepeat(false);

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
    <form ref={formRef} className={css.form} onSubmit={onSubmit}>
      <label className={css.inputGroup}>
        <span className={css.inputLabel}>Current password</span>

        <div className={css.passwordWrapper}>
          <input
            className={css.formInput}
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            name="currentPassword"
          />

          <button
            type="button"
            className={css.eyeButton}
            onClick={() => setShowCurrentPassword((prev) => !prev)}
          >
            <svg className={css.eyeIcon}>
              <use
                href={`/sprite.svg#${
                  showCurrentPassword
                    ? "icon-eye-crossed-medium"
                    : "icon-eye-medium"
                }`}
              />
            </svg>
          </button>
        </div>
      </label>

      <label className={css.inputGroup}>
        <span className={css.inputLabel}>New password</span>

        <div className={css.passwordWrapper}>
          <input
            className={css.formInput}
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            name="newPassword"
          />

          <button
            type="button"
            className={css.eyeButton}
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            <svg className={css.eyeIcon}>
              <use
                href={`/sprite.svg#${
                  showNewPassword
                    ? "icon-eye-crossed-medium"
                    : "icon-eye-medium"
                }`}
              />
            </svg>
          </button>
        </div>
      </label>

      <label className={css.inputGroup}>
        <span className={css.inputLabel}>Repeat new password</span>

        <div className={css.passwordWrapper}>
          <input
            className={css.formInput}
            type={showNewPasswordRepeat ? "text" : "password"}
            placeholder="Repeat new password"
            name="newPasswordRepeat"
          />

          <button
            type="button"
            className={css.eyeButton}
            onClick={() => setShowNewPasswordRepeat((prev) => !prev)}
          >
            <svg className={css.eyeIcon}>
              <use
                href={`/sprite.svg#${
                  showNewPasswordRepeat
                    ? "icon-eye-crossed-medium"
                    : "icon-eye-medium"
                }`}
              />
            </svg>
          </button>
        </div>
      </label>

      <button className={css.primaryButton} type="submit" disabled={isPending}>
        {isPending ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
