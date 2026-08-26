"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import css from "./layout.module.css";
import Header from "@/components/Header/Header";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={css.layout}>
        <div className={css.sidebarWrap}>
          <Sidebar />
        </div>
        <main className={css.main}>
          <div className={css.container}>
            <Header />
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default LayoutClient;
