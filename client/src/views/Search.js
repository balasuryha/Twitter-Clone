// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import Avatar from "../components/avatar/Avatar";
// import * as profileApi from "../api/requests/profile";

// export default function Search() {
//   const history = useHistory();
//   const current = useSelector((s) => s.currentProfile.data);
//   const currentFollowing = current?.following || [];

//   const [q, setQ] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const isFollowing = (user) =>
//     currentFollowing.some((f) => String(f?._id ?? f) === String(user._id));

//   // Debounced search as you type
//   useEffect(() => {
//     const query = q.trim();
//     if (!query) {
//       setResults([]);
//       setLoading(false);
//       return;
//     }
//     setLoading(true);

//     const controller = new AbortController();
//     const t = setTimeout(async () => {
//       try {
//         const res = await profileApi.searchProfiles(query, 1 /*page*/);
//         const items = res?.data?.results || [];
//         setResults(items);
//       } catch (e) {
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300); // debounce 300ms

//     return () => {
//       clearTimeout(t);
//       controller.abort?.();
//     };
//   }, [q]);

//   const handleRowClick = (u) => history.push(`/profile/${u.username}`);

//   return (
//     <div className="center-col" style={{ minHeight: "100%", borderLeft: "1px solid var(--border, #2f3336)", borderRight: "1px solid var(--border, #2f3336)" }}>
//       {/* Sticky top bar with search input */}
//       <div style={{ position: "sticky", top: 0, zIndex: 3, background: "var(--bg, #000)", padding: "12px", borderBottom: "1px solid var(--border, #2f3336)" }}>
//         <form
//           onSubmit={(e) => e.preventDefault()} // Enter not required; searches as you type
//           style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--input-bg, #16181c)", border: "1px solid var(--border, #2f3336)", borderRadius: 9999, padding: "10px 14px" }}
//         >
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search users"
//             style={{ flex: 1, background: "transparent", color: "var(--fg, #e7e9ea)", border: "none", outline: "none", fontSize: 15 }}
//           />
//           {/* Optional: “search” button if you want manual trigger (does same as typing) */}
//           <button
//             type="button"
//             onClick={() => setQ(q)} // no-op; could re-trigger search if you remove debounce
//             style={{ background: "transparent", border: 0, color: "var(--muted, #8b98a5)", cursor: "pointer" }}
//             title="Search"
//           >
//             🔍
//           </button>
//           {q && (
//             <button
//               type="button"
//               onClick={() => setQ("")}
//               style={{ background: "transparent", border: 0, color: "var(--muted, #8b98a5)", cursor: "pointer", fontSize: 18 }}
//               aria-label="Clear"
//               title="Clear"
//             >
//               ×
//             </button>
//           )}
//         </form>
//       </div>

//       {/* Results */}
//       <div>
//         {!q.trim() ? (
//           <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>
//             Type a name or @username to search.
//           </div>
//         ) : loading ? (
//           <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>Searching…</div>
//         ) : results.length === 0 ? (
//           <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>No users found.</div>
//         ) : (
//           results.map((u) => {
//             const following = isFollowing(u);
//             return (
//               <div
//                 key={u._id}
//                 className="search__row"
//                 onClick={() => handleRowClick(u)}
//                 style={{ display: "flex", gap: 12, padding: "10px 12px", borderBottom: "1px solid var(--border, #2f3336)", cursor: "pointer" }}
//               >
//                 <div style={{ flexShrink: 0 }}>
//                   <Avatar username={u.username} avatar={u.avatar} size="small" />
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
//                   <div>
//                     <div style={{ fontWeight: 600 }}>{u.fname || u.username}</div>
//                     <div style={{ color: "var(--muted, #8b98a5)", fontSize: 14 }}>@{u.username}</div>
//                     {u.bio ? <div style={{ color: "var(--muted, #8b98a5)", fontSize: 13, marginTop: 2 }}>{u.bio}</div> : null}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // TODO: dispatch follow/unfollow thunk here using your existing APIs
//                       // e.g., if (following) dispatch(unFollowVisitedProfile(u.username)) else dispatch(followVisitedProfile(u.username))
//                     }}
//                     style={{
//                       padding: "6px 12px",
//                       borderRadius: 9999,
//                       border: "1px solid var(--border, #2f3336)",
//                       background: following ? "transparent" : "var(--accent, #1d9bf0)",
//                       color: following ? "var(--fg, #e7e9ea)" : "#fff",
//                       fontWeight: 600,
//                       cursor: "pointer",
//                     }}
//                   >
//                     {following ? "Unfollow" : "Follow"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// src/views/Search.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Avatar from "../components/avatar/Avatar";
import * as profileApi from "../api/requests/profile";
import { getCurrentProfile } from "../redux/actions/currentProfileActions";
import {
  followVisitedProfile,
  unFollowVisitedProfile,
} from "../redux/actions/visitedProfileActions"; // you already have these

export default function Search() {
  const history = useHistory();
  const dispatch = useDispatch();

  const current = useSelector((s) => s.currentProfile.data);
  const currentFollowing = current?.following || [];

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper fallback (only used if API didn't send isFollowing)
  const clientIsFollowing = (user) =>
    currentFollowing.some((f) => {
      const id = String(f?._id ?? f ?? "");
      return id && id === String(user._id);
    }) ||
    currentFollowing.some((f) => f?.username && f.username === user.username);

  const fetchResults = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await profileApi.searchProfiles(query, 1);
      const items = res?.data?.results || [];
      setResults(items);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search as you type
  useEffect(() => {
    const t = setTimeout(() => fetchResults(q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleRowClick = (u) => history.push(`/profile/${u.username}`);

  const handleFollowToggle = async (u, following) => {
    // Prevent row navigation when clicking the button
    // (caller already calls e.stopPropagation())
    if (following) {
      await dispatch(unFollowVisitedProfile(u.username));
    } else {
      await dispatch(followVisitedProfile(u.username));
    }
    // Refresh both current profile and search results so isFollowing is correct
    await Promise.all([dispatch(getCurrentProfile()), fetchResults(q)]);
  };

  return (
    <div className="center-col" style={{ minHeight: "100%", borderLeft: "1px solid var(--border, #2f3336)", borderRight: "1px solid var(--border, #2f3336)" }}>
      {/* Sticky top bar with search input */}
      <div style={{ position: "sticky", top: 0, zIndex: 3, background: "var(--bg, #000)", padding: "12px", borderBottom: "1px solid var(--border, #2f3336)" }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--input-bg, #16181c)", border: "1px solid var(--border, #2f3336)", borderRadius: 9999, padding: "10px 14px" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users"
            style={{ flex: 1, background: "transparent", color: "var(--fg, #e7e9ea)", border: "none", outline: "none", fontSize: 15 }}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              style={{ background: "transparent", border: 0, color: "var(--muted, #8b98a5)", cursor: "pointer", fontSize: 18 }}
              aria-label="Clear"
              title="Clear"
            >
              ×
            </button>
          )}
        </form>
      </div>

      {/* Results */}
      <div>
        {!q.trim() ? (
          <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>
            Type a name or @username to search.
          </div>
        ) : loading ? (
          <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>Searching…</div>
        ) : results.length === 0 ? (
          <div style={{ padding: 16, color: "var(--muted, #8b98a5)" }}>No users found.</div>
        ) : (
          results.map((u) => {
            // Prefer server flag; fallback to client check
            const following = typeof u.isFollowing === "boolean" ? u.isFollowing : clientIsFollowing(u);
            const disableSelf = String(u._id) === String(current?._id);
            return (
              <div
                key={u._id}
                className="search__row"
                onClick={() => handleRowClick(u)}
                style={{ display: "flex", gap: 12, padding: "10px 12px", borderBottom: "1px solid var(--border, #2f3336)", cursor: "pointer" }}
              >
                <div style={{ flexShrink: 0 }}>
                  <Avatar username={u.username} avatar={u.avatar} size="small" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.fname || u.username}</div>
                    <div style={{ color: "var(--muted, #8b98a5)", fontSize: 14 }}>@{u.username}</div>
                    {u.bio ? <div style={{ color: "var(--muted, #8b98a5)", fontSize: 13, marginTop: 2 }}>{u.bio}</div> : null}
                  </div>

                  {!disableSelf && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(u, following);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 9999,
                        border: "1px solid var(--border, #2f3336)",
                        background: following ? "transparent" : "var(--accent, #1d9bf0)",
                        color: following ? "var(--fg, #e7e9ea)" : "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {following ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
