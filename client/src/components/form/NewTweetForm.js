// // // components/form/newTweetForm.js
// // import getFormData from "../../utils/getFormData";
// // import { useSelector, useDispatch } from "react-redux";
// // import { RiFileGifLine, GrEmoji, FiImage } from "react-icons/all";
// // import Avatar from "../avatar/Avatar";
// // import TextareaAutosize from "react-textarea-autosize";
// // import { newTweet } from "../../redux/actions/tweetActions";
// // import { useState } from "react";

// // const NewTweetForm = () => {
// //   const { username, avatar } = useSelector((state) => state.currentProfile.data);
// //   const dispatch = useDispatch();

// //   // --- Poll UI state ---
// //   const [isPoll, setIsPoll] = useState(false);
// //   const [question, setQuestion] = useState("");
// //   const [options, setOptions] = useState(["", ""]); // min 2
// //   const [durationHours, setDurationHours] = useState(24);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     // your helper returns { body: "...", ... }
// //     const base = getFormData(e.target);
// //     const payload = { ...base };

// //     if (isPoll) {
// //       const cleanQuestion = question.trim();
// //       const cleanOptions = options.map(o => o.trim()).filter(Boolean);
// //       if (!cleanQuestion || cleanOptions.length < 2) {
// //         // show toast or simple alert
// //         alert("Poll needs a question and at least 2 options.");
// //         return;
// //       }
// //       payload.poll = {
// //         question: cleanQuestion,
// //         options: cleanOptions,      // array of strings
// //         durationHours               // 24/48/168 etc.
// //       };
// //     }

// //     dispatch(newTweet(payload));
// //     // reset form & poll UI
// //     e.target.reset();
// //     setIsPoll(false);
// //     setQuestion("");
// //     setOptions(["", ""]);
// //     setDurationHours(24);
// //   };

// //   return (
// //     <div className="tweet-form display-flex align-items-fs">
// //       <div className="tweet-form__img display-flex justify-content-c align-items-c">
// //         <Avatar username={username} avatar={avatar} size="small" />
// //       </div>

// //       <form className="tweet-form__form" onSubmit={handleSubmit}>
// //         <TextareaAutosize name="body" placeholder="What's happening?" />

// //         {/* Poll toggle */}
// //         <div className="display-flex" style={{ gap: 8, margin: "8px 0" }}>
// //           <button
// //             type="button"
// //             onClick={() => setIsPoll(v => !v)}
// //             className={`btn btn-sm ${isPoll ? "active" : ""}`}
// //           >
// //             {isPoll ? "Remove Poll" : "Add Poll"}
// //           </button>
// //         </div>

// //         {isPoll && (
// //           <div className="poll-box" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)" }}>
// //             <input
// //               type="text"
// //               placeholder="Poll question"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               style={{ width: "100%", marginBottom: 8 }}
// //             />
// //             {options.map((opt, i) => (
// //               <input
// //                 key={i}
// //                 type="text"
// //                 placeholder={`Option ${i + 1}`}
// //                 value={opt}
// //                 onChange={(e) => {
// //                   const next = [...options];
// //                   next[i] = e.target.value;
// //                   setOptions(next);
// //                 }}
// //                 style={{ width: "100%", marginBottom: 6 }}
// //               />
// //             ))}

// //             <div className="display-flex" style={{ gap: 8, margin: "6px 0" }}>
// //               <button
// //                 type="button"
// //                 onClick={() => setOptions(o => [...o, ""])}
// //                 disabled={options.length >= 4}
// //               >
// //                 + Add option
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setOptions(o => o.slice(0, -1))}
// //                 disabled={options.length <= 2}
// //               >
// //                 − Remove option
// //               </button>

// //               <select
// //                 value={durationHours}
// //                 onChange={(e) => setDurationHours(Number(e.target.value))}
// //                 style={{ marginLeft: "auto" }}
// //               >
// //                 <option value={24}>24 hours</option>
// //                 <option value={48}>2 days</option>
// //                 <option value={168}>7 days</option>
// //               </select>
// //             </div>
// //           </div>
// //         )}

// //         <div className="display-flex justify-content-sb align-items-c">
// //           <ul className="display-flex">
// //             <li><FiImage /></li>
// //             <li><RiFileGifLine /></li>
// //             <li><GrEmoji /></li>
// //           </ul>
// //           <button className="tweet-form__btn">Tweet</button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default NewTweetForm;
// import getFormData from "../../utils/getFormData";
// import { useSelector, useDispatch } from "react-redux";
// import { RiFileGifLine, FiImage } from "react-icons/all";
// import Avatar from "../avatar/Avatar";
// import TextareaAutosize from "react-textarea-autosize";
// import { newTweet } from "../../redux/actions/tweetActions";
// import { useRef, useState } from "react";
// import EmojiButton from "../emoji/EmojiButton";
// import insertAtCursor from "../../utils/insertAtCursor";

// const NewTweetForm = () => {
//   const { username, avatar } = useSelector((state) => state.currentProfile.data);
//   const dispatch = useDispatch();

//   const [isPoll, setIsPoll] = useState(false);
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", ""]);
//   const [durationHours, setDurationHours] = useState(24);

//   // ref to the tweet body textarea
//   const bodyRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const base = getFormData(e.target);
//     const payload = { ...base };

//     if (isPoll) {
//       const cleanQuestion = question.trim();
//       const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
//       if (!cleanQuestion || cleanOptions.length < 2) {
//         alert("Poll needs a question and at least 2 options.");
//         return;
//       }
//       payload.poll = { question: cleanQuestion, options: cleanOptions, durationHours };
//     }

//     dispatch(newTweet(payload));
//     e.target.reset();
//     setIsPoll(false);
//     setQuestion("");
//     setOptions(["", ""]);
//     setDurationHours(24);
//   };

//   const handleEmojiSelect = (emoji) => {
//     if (bodyRef.current) insertAtCursor(bodyRef.current, emoji);
//   };

//   return (
//     <div className="tweet-form display-flex align-items-fs">
//       <div className="tweet-form__img display-flex justify-content-c align-items-c">
//         <Avatar username={username} avatar={avatar} size="small" />
//       </div>

//       <form className="tweet-form__form" onSubmit={handleSubmit}>
//         <TextareaAutosize
//           name="body"
//           placeholder="What's happening?"
//           ref={bodyRef} // ⬅️ get the DOM node
//         />

//         <div className="display-flex" style={{ gap: 8, margin: "8px 0" }}>
//           <button type="button" onClick={() => setIsPoll((v) => !v)} className={`btn btn-sm ${isPoll ? "active" : ""}`}>
//             {isPoll ? "Remove Poll" : "Add Poll"}
//           </button>
//         </div>

//         {isPoll && (
//           <div className="poll-box" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)" }}>
//             <input
//               type="text"
//               placeholder="Poll question"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//             {options.map((opt, i) => (
//               <input
//                 key={i}
//                 type="text"
//                 placeholder={`Option ${i + 1}`}
//                 value={opt}
//                 onChange={(e) => {
//                   const next = [...options];
//                   next[i] = e.target.value;
//                   setOptions(next);
//                 }}
//                 style={{ width: "100%", marginBottom: 6 }}
//               />
//             ))}

//             <div className="display-flex" style={{ gap: 8, margin: "6px 0" }}>
//               <button type="button" onClick={() => setOptions((o) => [...o, ""])} disabled={options.length >= 4}>
//                 + Add option
//               </button>
//               <button type="button" onClick={() => setOptions((o) => o.slice(0, -1))} disabled={options.length <= 2}>
//                 − Remove option
//               </button>

//               <select
//                 value={durationHours}
//                 onChange={(e) => setDurationHours(Number(e.target.value))}
//                 style={{ marginLeft: "auto" }}
//               >
//                 <option value={24}>24 hours</option>
//                 <option value={48}>2 days</option>
//                 <option value={168}>7 days</option>
//               </select>
//             </div>
//           </div>
//         )}

//         <div className="display-flex justify-content-sb align-items-c">
//           <ul className="display-flex" style={{ gap: 8 }}>
//             <li>
//               <EmojiButton onSelect={handleEmojiSelect} />
//             </li>
//             <li><FiImage /></li>
//             <li><RiFileGifLine /></li> 
//           </ul>
//           <button className="tweet-form__btn">Tweet</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewTweetForm;
import getFormData from "../../utils/getFormData";
import { useSelector, useDispatch } from "react-redux";
import { RiFileGifLine, FiImage } from "react-icons/all";
import Avatar from "../avatar/Avatar";
import TextareaAutosize from "react-textarea-autosize";
import { newTweet } from "../../redux/actions/tweetActions";
import { useRef, useState } from "react";
import EmojiButton from "../emoji/EmojiButton";
import insertAtCursor from "../../utils/insertAtCursor";

const NewTweetForm = () => {
  const { username, avatar } = useSelector((state) => state.currentProfile.data);
  const dispatch = useDispatch();

  const [isPoll, setIsPoll] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [durationHours, setDurationHours] = useState(24);

  // ref to the tweet body textarea
  const bodyRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const base = getFormData(e.target);
    const payload = { ...base };

    if (isPoll) {
      const cleanQuestion = question.trim();
      const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
      if (!cleanQuestion || cleanOptions.length < 2) {
        alert("Poll needs a question and at least 2 options.");
        return;
      }
      payload.poll = { question: cleanQuestion, options: cleanOptions, durationHours };
    }

    dispatch(newTweet(payload));
    e.target.reset();
    setIsPoll(false);
    setQuestion("");
    setOptions(["", ""]);
    setDurationHours(24);
  };

  const handleEmojiSelect = (emoji) => {
    if (bodyRef.current) insertAtCursor(bodyRef.current, emoji);
  };

  return (
    <div className="tweet-form display-flex align-items-fs">
      <div className="tweet-form__img display-flex justify-content-c align-items-c">
        <Avatar username={username} avatar={avatar} size="small" />
      </div>

      <form className="tweet-form__form" onSubmit={handleSubmit}>
        <TextareaAutosize
          name="body"
          placeholder="What's happening?"
          ref={bodyRef} // ⬅️ get the DOM node
        />

        <div className="display-flex" style={{ gap: 8, margin: "8px 0" }}>
          <button
            type="button"
            onClick={() => setIsPoll((v) => !v)}
            className={`btn btn-sm ${isPoll ? "active" : ""}`}
          >
            {isPoll ? "Remove Poll" : "Add Poll"}
          </button>
        </div>

        {isPoll && (
          <div className="poll-box" style={{ padding: 8, borderRadius: 8, border: "1px solid var(--border)" }}>
            <input
              type="text"
              placeholder="Poll question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%", marginBottom: 8 }}
            />

            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                style={{ width: "100%", marginBottom: 6 }}
              />
            ))}

            <div className="display-flex" style={{ gap: 8, margin: "6px 0" }}>
              <button type="button" onClick={() => setOptions((o) => [...o, ""])} disabled={options.length >= 4}>
                + Add option
              </button>
              <button type="button" onClick={() => setOptions((o) => o.slice(0, -1))} disabled={options.length <= 2}>
                − Remove option
              </button>

              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                style={{ marginLeft: "auto" }}
              >
                <option value={24}>24 hours</option>
                <option value={48}>2 days</option>
                <option value={168}>7 days</option>
              </select>
            </div>
          </div>
        )}

        <div className="display-flex justify-content-sb align-items-c">
          <ul
            className="display-flex"
            style={{ gap: 8, alignItems: "center", flexWrap: "nowrap" }}
          >
            <li><FiImage /></li>
            <li><RiFileGifLine /></li>
            <li><EmojiButton onSelect={handleEmojiSelect} /></li>
          </ul>
          <button className="tweet-form__btn">Tweet</button>
        </div>
      </form>
    </div>
  );
};

export default NewTweetForm;
