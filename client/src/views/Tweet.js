// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import TweetCard from "../components/card/TweetCard/TweetCard";
// import CommentForm from "../components/form/CommentForm";
// import { useSelector, useDispatch } from "react-redux";
// import { getTweetById } from "../redux/actions/tweetActions";

// function Tweet() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const tweet = useSelector((state) => state.tweet);
//   const { tweetById, newTweet, modifiedTweet } = tweet;

//   useEffect(() => {
//     dispatch(getTweetById(id));
//   }, [dispatch, id, newTweet, modifiedTweet]);

//   return tweetById ? (
//     <div>
//       <TweetCard tweet={tweetById} />
//       <CommentForm tweet={tweetById} />
//       <div className="tweet__replies">Replies</div>
//       {tweetById.replies.map((comment) => (
//         <TweetCard tweet={comment} />
//       ))}
//     </div>
//   ) : (
//     <Spinner />
//   );
// }

// export default Tweet;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTweetById } from "../redux/actions/tweetActions";
import TweetCard from "../components/card/TweetCard/TweetCard";
import CommentForm from "../components/form/CommentForm";

export default function Tweet() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { byId: tweet, loadingById, errorById } = useSelector((s) => s.tweet);

  useEffect(() => {
    dispatch(getTweetById(id));
  }, [dispatch, id]);

  if (loadingById) return <div className="loader" />; // your spinner
  if (errorById) return <p style={{ padding: 16 }}>{errorById}</p>;
  if (!tweet) return null;

  return (
    <>
      <TweetCard tweet={tweet} />
      {/* replies */}
      <CommentForm />
      {tweet.replies?.map((r) => (
        <TweetCard key={r._id} tweet={r} />
      ))}
    </>
  );
}
