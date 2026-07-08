import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 900
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`${styles.main} ${
          sidebarOpen
            ? styles.expanded
            : styles.collapsed
        }`}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;