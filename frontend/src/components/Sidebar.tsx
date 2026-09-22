import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import "../styles/Sidebar.css";
import ROCTLogo from "../assets/ROCT.png";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={ROCTLogo} alt="ROCT" />
        </div>

        <button className="sidebar-toggle" onClick={onToggle}>
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <span>🏠</span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/products" className="sidebar-link">
          <span>📦</span>
          {!collapsed && <span>Products</span>}
        </NavLink>

        <NavLink to="/notifications" className="sidebar-link">
          <span>🔔</span>
          {!collapsed && <span>Notifications</span>}
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <span>👤</span>
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>

    </aside>
  );
}

export default Sidebar;