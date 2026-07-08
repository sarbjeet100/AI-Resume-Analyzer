import {
  LayoutDashboard,
  Upload,
  FileSearch,
  History,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import styles from "./Sidebar.module.css";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Upload Resume",
    icon: Upload,
    path: "/upload",
  },
  {
    title: "Analysis",
    icon: FileSearch,
    path: "/analysis",
  },
  {
    title: "History",
    icon: History,
    path: "/history",
  },
  {
    title: "Job Recommendation",
    icon: BriefcaseBusiness,
    path: "/job-recommendation",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
];

const Sidebar = ({ open, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        open ? styles.open : styles.closed
      }`}
    >
      <div className={styles.header}>
        {open && (
          <h2 className={styles.logo}>
            ResumeAI
          </h2>
        )}

        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {open ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `${styles.link} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Icon size={20} />

              {open && (
                <span>{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.logout}
          onClick={handleLogout}
        >
          <LogOut size={20} />

          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;