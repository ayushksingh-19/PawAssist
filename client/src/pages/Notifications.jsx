import { useMemo, useState } from "react";
import { FiArchive, FiBell, FiCheckCircle, FiRotateCcw } from "react-icons/fi";
import useSettingsStore from "../store/useSettingsStore";

export default function Notifications() {
  const notifications = useSettingsStore((state) => state.notifications);
  const markNotificationRead = useSettingsStore((state) => state.markNotificationRead);
  const archiveNotification = useSettingsStore((state) => state.archiveNotification);
  const restoreNotification = useSettingsStore((state) => state.restoreNotification);
  const markAllNotificationsRead = useSettingsStore((state) => state.markAllNotificationsRead);
  const [showArchived, setShowArchived] = useState(false);

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => item.archived === showArchived),
    [notifications, showArchived],
  );

  return (
    <div className="settings-page notifications-page">
      <header className="settings-hero">
        <div>
          <h1>Notifications</h1>
          <p>Manage reminders, care alerts, and account activity from one place.</p>
        </div>
      </header>

      <section className="settings-panel">
        <div className="settings-panel-head">
          <h2>{showArchived ? "Archived Notifications" : "Active Notifications"}</h2>
          <div className="settings-actions">
            <button type="button" className="settings-secondary-button" onClick={() => setShowArchived((current) => !current)}>
              {showArchived ? "Show Active" : "Show Archived"}
            </button>
            {!showArchived ? (
              <button type="button" className="settings-primary-button" onClick={markAllNotificationsRead}>
                Mark All Read
              </button>
            ) : null}
          </div>
        </div>

        <div className="settings-notification-list">
          {visibleNotifications.length ? (
            visibleNotifications.map((item) => (
              <article key={item.id} className={`settings-notification-card ${item.read ? "read" : "unread"} priority-${item.priority}`}>
                <div className="settings-notification-head">
                  <div className="settings-notification-title">
                    <span className="settings-notification-icon"><FiBell /></span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                  <span>{item.time}</span>
                </div>
                <div className="settings-notification-actions">
                  {!showArchived ? (
                    <>
                      <button type="button" className="settings-secondary-button" onClick={() => markNotificationRead(item.id, !item.read)}>
                        <FiCheckCircle />
                        {item.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button type="button" className="settings-secondary-button" onClick={() => archiveNotification(item.id)}>
                        <FiArchive />
                        Archive
                      </button>
                    </>
                  ) : (
                    <button type="button" className="settings-secondary-button" onClick={() => restoreNotification(item.id)}>
                      <FiRotateCcw />
                      Restore
                    </button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="settings-empty-card">
              <strong>No notifications here right now.</strong>
              <p>{showArchived ? "Archived alerts will appear here." : "You are all caught up."}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
