import React, { useState } from "react";
import { getPublicKey, subscribePush, unsubscribePush } from "../../api/requests/push";

function b64ToUint8Array(b64) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export default function EnablePushButton() {
  const [busy, setBusy] = useState(false);
  const [supported] = useState(() => "serviceWorker" in navigator && "PushManager" in window);

  const enable = async () => {
    if (!supported) return alert("Push not supported in this browser.");
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return alert("Permission denied.");

      // register (or get) the SW
      const reg = await navigator.serviceWorker.register("/sw.js");

      // avoid duplicate subs
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const { data } = await getPublicKey();
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: b64ToUint8Array(data.publicKey),
        });
      }

      await subscribePush(sub.toJSON());
      alert("Push notifications enabled.");
    } catch (e) {
      console.error(e);
      alert("Failed to enable push.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      }
      alert("Push notifications disabled.");
    } catch (e) {
      console.error(e);
      alert("Failed to disable push.");
    } finally {
      setBusy(false);
    }
  };

  if (!supported) return null;

  return (
    <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
      <button onClick={enable} disabled={busy}>Enable notifications</button>
      <button onClick={disable} disabled={busy}>Disable</button>
    </div>
  );
}
