"use client";
import { useState } from "react";
import css from "./AuthForms.module.css";
import Link from "next/link";
import { login, register } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore/authStore";
interface AuthFormsProps {
  type: "login" | "register";
}

export default function AuthForms({ type }: AuthFormsProps) {
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  // ! INVALID CREDENTIALS ERROR WHEN USER LOG INS WITHOUT ACC
  const errorHandler = (error: unknown) => {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.response?.validation?.body?.message ??
        error.response?.data?.response?.message ??
        error.response?.data?.message;

      setError(
        message
          ? message.toUpperCase()
          : "Something went wrong. Please try again.",
      );

      return;
    }

    setError("Something went wrong. Please try again.");
  };

  const getFormValue = (formData: FormData, name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  async function handleSubmit(formdata: FormData) {
    setError(null);
    if (!open) {
      setIsOpen(true);
      return;
    }
    const email = getFormValue(formdata, "email");
    const password = getFormValue(formdata, "password");
    if (!email || !password) {
      setError("Please fill out all the fields!");
      return;
    }

    try {
      if (type === "login") {
        const user = await login({ email, password });
        setUser(user);
        router.push("/catalogue");
      } else {
        const username = getFormValue(formdata, "username");
        const passwordRepeat = getFormValue(formdata, "passwordRepeat");

        if (!username || !passwordRepeat) {
          setError("Please fill out all the fields!");
          return;
        }

        if (password !== passwordRepeat) {
          setError("Passwords do not match!");
          return;
        }

        const user = await register({
          email,
          password,
          username,
        });

        setUser(user);
        router.push("/catalogue");
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  return (
    <div className={css.authWrapper}>
      <form
        noValidate
        className={`${css.authForm}  ${open ? css.open : ""}`}
        action={handleSubmit}
      >
        <div className={`${css.formContent}  ${open ? css.open : ""}`}>
          <div className={css.formContentInner}>
            <label className={css.inputLabel}>
              Email
              <input
                className={css.formInput}
                placeholder="Write your email here..."
                type="email"
                name="email"
                required
              />
            </label>
            {type === "register" && (
              <label className={css.inputLabel}>
                Name
                <input
                  className={css.formInput}
                  placeholder="Write what do we call you here..."
                  type="text"
                  name="username"
                  required
                />
              </label>
            )}
            <label className={css.inputLabel}>
              Password
              <input
                className={css.formInput}
                placeholder="Write your password here..."
                type="password"
                name="password"
                required
              />
            </label>
            {type === "register" && (
              <label className={css.inputLabel}>
                Repeat Password
                <input
                  className={css.formInput}
                  placeholder="Repeat your password here..."
                  type="password"
                  name="passwordRepeat"
                  required
                />
              </label>
            )}
          </div>
        </div>

        {error && <p className={css.error}>{error}</p>}

        <button type="submit" className={css.authButton}>
          {open ? "Submit" : type === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      {type === "login" ? (
        <p className={css.navText}>
          No Account? &nbsp;
          <Link className={css.navLink} href={"/auth/register"}>
            Sign up
          </Link>
        </p>
      ) : (
        <p className={css.navText}>
          Already have an account? &nbsp;
          <Link className={css.navLink} href={"/auth/login"}>
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
