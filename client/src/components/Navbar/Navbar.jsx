import {
  Menu,
  LogOut,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Navbar.module.css";

const Navbar = ({
  sidebarOpen,
  toggleSidebar,
}) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2>AI Resume Analyzer</h2>

          <span className={styles.subtitle}>
            Smart Resume Screening
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.userInfo}
          onClick={() =>
            navigate("/profile")
          }
          style={{
            cursor: "pointer",
          }}
        >
          <div
            className={styles.avatar}
          >
            <User size={20} />
          </div>

          <div>
            <h4>
              {user?.name || "User"}
            </h4>

            <p>
              {user?.email ||
                "No Email"}
            </p>
          </div>
        </div>

        <button
          className={
            styles.logoutButton
          }
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;