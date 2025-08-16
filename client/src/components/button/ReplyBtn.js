import React from "react";
import { FaRegComment } from "react-icons/all";
// const ReplyBtn = ({ replies }) => {
//   return (
//     <div className="display-flex align-items-c tweet-btns__btn tweet-btns__reply">
//       <FaRegComment />
//       <small>{replies}</small>
//     </div>
//   );
// };
const ReplyBtn = ({ replies, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="display-flex align-items-c tweet-btns__btn tweet-btns__reply"
      style={{ cursor: "pointer" }}
    >
      <FaRegComment />
      <small>{replies}</small>
    </div>
  );
};

export default ReplyBtn;
