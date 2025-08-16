// components/modal/ChangePasswordModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  verifyPasswordThunk,
  changePasswordThunk,
} from "../../redux/actions/currentProfileActions";

export default function ChangePasswordModal({ open, onClose }) {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // reset state whenever the modal opens/closes
  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setVerified(false);
    setMsg("");
    setErr("");
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleVerify = async () => {
    setErr(""); setMsg(""); setLoading(true);
    const res = await dispatch(verifyPasswordThunk(currentPassword));
    setLoading(false);
    if (res?.payload?.status >= 200 && res?.payload?.status < 300) {
      setVerified(true);
      setMsg("Current password verified. Enter a new password.");
    } else {
      setErr(res?.payload?.data?.message || "Current password is incorrect");
    }
  };

  const handleChangePassword = async () => {
    setErr(""); setMsg(""); setLoading(true);

    if (!newPassword || !confirm) {
      setLoading(false);
      return setErr("Please enter and confirm your new password.");
    }
    if (newPassword !== confirm) {
      setLoading(false);
      return setErr("Passwords do not match.");
    }

    const res = await dispatch(
      changePasswordThunk({ currentPassword, newPassword, confirm })
    );
    setLoading(false);

    if (res?.payload?.status >= 200 && res?.payload?.status < 300) {
      setMsg("Password changed successfully.");
      // close after a brief moment
      setTimeout(() => onClose?.(), 700);
    } else {
      setErr(res?.payload?.data?.message || "Unable to change password.");
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Change Password"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 95vw)",
          background: "var(--bg,#000)",
          border: "1px solid var(--border,#2f3336)",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border,#2f3336)",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Change password
        </div>

        <div style={{ padding: 16, display: "grid", gap: 10 }}>
          {!verified ? (
            <>
              <input
    type="password"
    placeholder="Current password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    style={{
      fontSize: "18px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid var(--border,#2f3336)",
    }}
  />
  <button
  type="button"
  className="tweet-form__btn"
  onClick={handleVerify}
  disabled={loading || !currentPassword}
  style={{
    fontSize: "18px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "#1d9bf0", // Twitter blue
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#1a8cd8")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#1d9bf0")}
>
  {loading ? "Verifying..." : "Verify current password"}
</button>

            </>
          ) : (
            <>
              <input
    type="password"
    placeholder="New password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    style={{
      fontSize: "18px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid var(--border,#2f3336)",
    }}
  />
  <input
    type="password"
    placeholder="Confirm new password"
    value={confirm}
    onChange={(e) => setConfirm(e.target.value)}
    style={{
      fontSize: "18px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid var(--border,#2f3336)",
    }}
  />
  <button
    type="button"
    className="tweet-form__btn"
    onClick={handleChangePassword}
    disabled={loading}
    style={{
      fontSize: "18px",
      padding: "12px 16px",
      borderRadius: "8px",
    }}
  >
    {loading ? "Saving..." : "Update password"}
  </button>

            </>
          )}

          {err && <small style={{ color: "salmon" }}>{err}</small>}
          {msg && <small style={{ color: "lightgreen" }}>{msg}</small>}
        </div>
      </div>
    </div>
  );
}
