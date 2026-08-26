"use client";
import { useState } from "react";
import css from "./AuthForms.module.css";
import Link from "next/link";
interface AuthFormsProps {
  type: "login" | "register";
}

export default function AuthForms({ type }: AuthFormsProps) {
  const [open, setIsOpen] = useState(false);
  function handleSubmit() {
    if (!open) {
      setIsOpen(true);
      return;
    }

    // real submit logic goes here (validate + call your API)
  }

  return (
    <div className={css.authWrapper}>
      <form
        className={`${css.authForm}  ${open ? css.open : ""}`}
        action={handleSubmit}
      >
        <div className={`${css.formContent}  ${open ? css.open : ""}`}>
          <div className={css.formContentInner}>
            <label className={css.inputLabel}>
              Email
              <input
                className={css.formInput}
                placeholder="Write your Name here..."
                type="email"
              ></input>
            </label>
            {type === "register" && (
              <label className={css.inputLabel}>
                Name
                <input
                  className={css.formInput}
                  placeholder="Write what do we call you here..."
                  type="text"
                ></input>
              </label>
            )}
            <label className={css.inputLabel}>
              Password
              <input
                className={css.formInput}
                placeholder="Write your password here..."
                type="password"
              ></input>
            </label>
            {type === "register" && (
              <label className={css.inputLabel}>
                Repeat Password
                <input
                  className={css.formInput}
                  placeholder="Repeat your password here..."
                  type="password"
                ></input>
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={css.authButton}
          onClick={() => setIsOpen(true)}
        >
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
