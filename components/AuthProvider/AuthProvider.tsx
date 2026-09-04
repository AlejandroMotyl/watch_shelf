"use client";
import { getProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import React, { useEffect } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  useEffect(() => {
    const getUser = async () => {
      if (isAuthenticated) {
        const user = await getProfile();
        if (user) setUser(user);
      } else {
        clearIsAuthenticated();
      }
    };
    void getUser();
  }, [setUser, clearIsAuthenticated, isAuthenticated]);

  return children;
}
