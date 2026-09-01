"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import css from "./layout.module.css";
import Header from "@/components/Header/Header";
import Container from "@/components/Container/Container";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <div className={css.layout}>
        <div className={css.sidebarWrap}>
          <Sidebar />
        </div>
        <main className={css.main}>
          <Header />
          {children}
        </main>
      </div>
    </Container>
  );
};

export default LayoutClient;
