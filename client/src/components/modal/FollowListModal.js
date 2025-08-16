// components/modal/FollowListModal.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import FollowBtn from "../button/FollowBtn";

export default function FollowListModal({ open, onClose, title, users = [] }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",   // ⬅️ center vertically
        justifyContent: "center", // ⬅️ center horizontally
        padding: 16, // small gutter on tiny screens
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px, 95vw)",
          maxHeight: "80vh",
          overflow: "auto",
          background: "var(--bg,#000)",
          border: "1px solid var(--border,#2f3336)",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          className="modal-header"
          style={{
            position: "sticky",
            top: 0,
            background: "var(--bg,#000)",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border,#2f3336)",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {title}
        </div>

        {users.length === 0 ? (
          <div style={{ padding: 16, color: "var(--muted,#8b98a5)" }}>
            No users.
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="modal-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderBottom: "1px solid var(--border,#2f3336)",
              }}
            >
              <Link
                to={`/profile/${u.username}`}
                style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}
                onClick={onClose}
              >
                <Avatar username={u.username} avatar={u.avatar} size="small" />
                <div>
                  <div style={{ fontWeight: 600 }}>{u.fname || u.username}</div>
                  <div style={{ color: "var(--muted,#8b98a5)", fontSize: 13 }}>
                    @{u.username}
                  </div>
                </div>
              </Link>

              {u.username && (
                <FollowBtn username={u.username} followers={u.followers || []} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
