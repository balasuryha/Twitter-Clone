// import React from "react";
// import RetweetBtn from "../../button/RetweetBtn";
// import ReplyBtn from "../../button/ReplyBtn";
// import LikeBtn from "../../button/LikeBtn";
// import BookmarkBtn from "../../button/BookmarkBtn";
// const TweetIcons = ({ tweet, className }) => {
//   return (
//     <div
//       className={`tweet__icons display-flex justify-content-sb ${className}`}
//     >
//       <ReplyBtn replies={tweet.replies.length} />
//       <RetweetBtn id={tweet._id} retweets={tweet.retweets.length} />
//       <LikeBtn id={tweet._id} likes={tweet.likes} />
//       <BookmarkBtn id={tweet._id} />
//     </div>
//   );
// };

// export default TweetIcons;
import React from "react";
import RetweetBtn from "../../button/RetweetBtn";
import ReplyBtn from "../../button/ReplyBtn";
import LikeBtn from "../../button/LikeBtn";
import BookmarkBtn from "../../button/BookmarkBtn";

const TweetIcons = ({ tweet, className, onReplyClick }) => {
  return (
    <div className={`tweet__icons display-flex justify-content-sb ${className}`}>
      <ReplyBtn
  replies={tweet.replies.length}
  onClick={(e) => {
    e.preventDefault();     // stop <Link> navigation
    e.stopPropagation();    // stop bubbling
    onReplyClick?.();       // toggle reply box
  }}
/>

      <RetweetBtn id={tweet._id} retweets={tweet.retweets.length} />
      <LikeBtn id={tweet._id} likes={tweet.likes} />
      <BookmarkBtn id={tweet._id} />
    </div>
  );
};

export default TweetIcons;
