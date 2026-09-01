"use client";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

interface GlobalScrollbarProps {
  children: React.ReactNode;
}

export default function GlobalScrollbar({ children }: GlobalScrollbarProps) {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          autoHide: "never",
          theme: "scrollbarGlobalTheme",
        },
      }}
      defer
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
