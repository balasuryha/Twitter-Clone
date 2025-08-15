import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../avatar/Avatar";
import TweetIcons from "./TweetIcons";
import TweetBody from "./TweetBody";
import TweetHeader from "./TweetHeader";
import Poll from "../../poll/Poll";

const TweetCard = ({ tweet, isRetweeted }) => {
  return (
    <Link
      className={`tweet display-flex ${isRetweeted && "tweet__retweet"}`}
      to={`/tweet/${tweet._id}`}
    >
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

        {/* ⬇️ render the poll here */}
        {tweet.poll && <Poll tweet={tweet} />}

        <TweetIcons tweet={tweet} className={isRetweeted && "display-none"} />
      </div>
    </Link>
  );
};

export default TweetCard;
