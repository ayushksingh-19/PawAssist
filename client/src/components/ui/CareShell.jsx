import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import useSystemStatus from "../../services/useSystemStatus";
import PawAssistBrand from "./PawAssistBrand";
import useSettingsStore from "../../store/useSettingsStore";

const navigation = [
  { to: "/app/dashboard", label: "Dashboard", icon: "DB" },
  { to: "/app/pets", label: "My Pets", icon: "PT" },
  { to: "/app/booking", label: "Bookings", icon: "BK" },
  { to: "/app/chat", label: "Messages", icon: "MS" },
  { to: "/app/health", label: "Health Tracker", icon: "HT" },
  { to: "/app/ai-assistant", label: "AI Assistant", icon: "AI" },
  { to: "/app/community", label: "Community", icon: "CM" },
  { to: "/app/insurance", label: "Insurance", icon: "IN" },
  { to: "/app/wallet", label: "Wallet", icon: "WL" },
];

export default function CareShell() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const unreadNotifications = useSettingsStore((state) =>
    state.notifications.filter((item) => !item.read && !item.archived).length,
  );
  const systemStatus = useSystemStatus();
  const initials = (user?.name || "Pet Parent")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="care-layout">
      <aside className="care-sidebar">
        <div className="care-brand">
          <PawAssistBrand />
          <div>
            <strong>PawAssist</strong>
            <p>Pet Care Companion</p>
          </div>
        </div>

        <div className="care-user-card">
          <button type="button" className="care-user-card-button" onClick={() => navigate("/app/settings")}>
            <div className="care-user-avatar">{initials}</div>
            <div>
              <strong>{user?.name || "Pet Parent"}</strong>
              <p>{user?.phone || "Local mode"}</p>
            </div>
          </button>
        </div>

        <div className={`care-status-badge ${systemStatus.state}`}>
          <strong>{systemStatus.label}</strong>
          <p>{systemStatus.detail}</p>
        </div>

        <button className="care-premium-button" onClick={() => navigate("/app/premium")}>
          Upgrade to Premium
        </button>
        <div className="care-nav-group">MAIN MENU</div>

        <nav className="care-sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              <span className="care-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="care-support-card">
          <span className="care-support-eyebrow">Enterprise readiness</span>
          <strong>Ops visibility enabled</strong>
          <p>Live system badge, Mongo-backed API, and fallback continuity are active.</p>
        </div>

        <div className="care-bottom-actions">
          <NavLink to="/app/notifications" className={({ isActive }) => `sidebar-link care-bottom-link${isActive ? " active" : ""}`}>
            <span className="care-link-icon">NT</span>
            Notifications
            {unreadNotifications ? <span className="care-link-badge">{unreadNotifications}</span> : null}
          </NavLink>
          <NavLink to="/app/settings" className={({ isActive }) => `sidebar-link care-bottom-link${isActive ? " active" : ""}`}>
            <span className="care-link-icon">ST</span>
            Settings
          </NavLink>
        </div>

        <button className="care-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="care-main">
        <Outlet />
      </main>
    </div>
  );
}
