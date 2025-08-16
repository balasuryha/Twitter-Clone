// import React from "react";
// import { Link } from "react-router-dom";
// import Avatar from "../../avatar/Avatar";
// import TweetIcons from "./TweetIcons";
// import TweetBody from "./TweetBody";
// import TweetHeader from "./TweetHeader";
// import Poll from "../../poll/Poll";

// const TweetCard = ({ tweet, isRetweeted }) => {
//   return (
//     <Link
//       className={`tweet display-flex ${isRetweeted && "tweet__retweet"}`}
//       to={`/tweet/${tweet._id}`}
//     >
//       <div className="tweet__side--left">
//         <Avatar
//           username={tweet.author.username}
//           avatar={tweet.author.avatar}
//           size="small"
//         />
//       </div>

//       <div className="tweet__side--right">
//         <TweetHeader
//           tweet={tweet}
//           author={tweet.author}
//           createdAt={tweet.createdAt}
//         />

//         <TweetBody body={tweet.body} originalTweet={tweet.originalTweet} />

//         {/* ⬇️ render the poll here */}
//         {tweet.poll && <Poll tweet={tweet} />}

//         <TweetIcons tweet={tweet} className={isRetweeted && "display-none"} />
//       </div>
//     </Link>
//   );
// };

// export default TweetCard;
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Avatar from "../../avatar/Avatar";
import TweetIcons from "./TweetIcons";
import TweetBody from "./TweetBody";
import TweetHeader from "./TweetHeader";
import Poll from "../../poll/Poll";
import { newReply } from "../../../redux/actions/tweetActions";
import ReplyBtn from "../../button/ReplyBtn";

const TweetCard = ({ tweet, isRetweeted }) => {
  const dispatch = useDispatch();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const textareaRef = useRef(null);

  const handleReply = () => {
    const data = textareaRef.current.value;
    if (!data.trim()) return;
    dispatch(newReply({ data, id: tweet._id }));
    textareaRef.current.value = "";
    setShowReplyBox(false);
  };

  return (
    <div className={`tweet__wrapper ${isRetweeted ? "tweet__retweet" : ""}`}>
      {/* Tweet Card Display */}
      <Link className="tweet display-flex" to={`/tweet/${tweet._id}`}>
        <div className="tweet__side--left">
          <Avatar
            username={tweet.author.username}
            avatar={tweet.author.avatar}
            size="small"
          />
        </div>

        <div className="tweet__side--right">
          <TweetHeader
            tweet={tweet}
            author={tweet.author}
            createdAt={tweet.createdAt}
          />

          <TweetBody body={tweet.body} originalTweet={tweet.originalTweet} />

          {tweet.poll && <Poll tweet={tweet} />}

          <TweetIcons
            tweet={tweet}
            className={isRetweeted ? "display-none" : ""}
            onReplyClick={() => setShowReplyBox(!showReplyBox)}
          />
        </div>
      </Link>

      {/* 🔽 Reply Textarea Box (outside <Link>) */}
      {showReplyBox && (
        <div
          className="tweet__reply-box"
          style={{
            paddingLeft: 60,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <textarea
            ref={textareaRef}
            placeholder="Write your reply..."
            rows="3"
            style={{
              width: "90%",
              resize: "none",
              fontSize: "15px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border,#2f3336)",
              backgroundColor: "var(--bg,#000)",
              color: "var(--text,#fff)",
              outline: "none",
            }}
          />
          <button
            onClick={handleReply}
            style={{
              alignSelf: "flex-start",
              padding: "8px 16px",
              fontSize: "15px",
              borderRadius: "6px",
              backgroundColor: "#1d9bf0",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1a8cd8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1d9bf0")}
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default TweetCard;