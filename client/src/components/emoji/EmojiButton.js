import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/all";

export default function EmojiButton({ onSelect, size = 20 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on click outside
  useEffect(() => {
    const onDoc = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label="Insert emoji"
        onClick={() => setOpen((v) => !v)}
        style={{ background: "transparent", border: 0, cursor: "pointer" }}
      >
        <GrEmoji size={size} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "110%", // pop above the icon
            right: -100,
            zIndex: 9999,
          }}
        >
          <Picker
            onEmojiClick={(emojiData) => {
              const emoji = emojiData.emoji || emojiData.native || "";
              onSelect?.(emoji);
              setOpen(false);
            }}
            autoFocusSearch={false}
          />
        </div>
      )}
    </div>
  );
}
// import React, { useEffect, useRef, useState } from "react";
// import Picker from "emoji-picker-react";
// import { GrEmoji } from "react-icons/all";

// export default function EmojiButton({ onSelect, size = 20 }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   // close on click outside
//   useEffect(() => {
//     const onDoc = (e) => {
//       if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDoc);
//     return () => document.removeEventListener("mousedown", onDoc);
//   }, [open]);

//   return (
//     // ⬇️ CHANGED: keep this element in normal flow so it stays inline in the flex row
//     <div ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
//       <button
//         type="button"
//         aria-label="Insert emoji"
//         onClick={() => setOpen((v) => !v)}
//         style={{ background: "transparent", border: 0, cursor: "pointer" }}
//       >
//         <GrEmoji size={size} />
//       </button>

//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "110%", // pop above the icon; use top:"100%" to pop below if preferred
//             right: 0,
//             zIndex: 9999,
//           }}
//         >
//           <Picker
//             onEmojiClick={(emojiData) => {
//               const emoji = emojiData.emoji || emojiData.native || "";
//               onSelect?.(emoji);
//               setOpen(false);
//             }}
//             autoFocusSearch={false}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
