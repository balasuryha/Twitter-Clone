import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../avatar/Avatar";
import TweetIcons from "./TweetIcons";
import TweetBody from "./TweetBody";
import TweetHeader from "./TweetHeader";

function normalizeMedia(raw = []) {
  
  return (Array.isArray(raw) ? raw : [])
    .map((m) =>
      typeof m === "string"
        ? { type: /\.(mp4|webm)(\?|#|$)/i.test(m) ? "video" : "image", url: m }
        : m
    )
    .filter((m) => m && m.url);
}

function TweetMedia({ media }) {
  const items = normalizeMedia(media);
  if (!items.length) return null;

  const hasVideo = items.some((m) => m.type === "video");
  if (hasVideo) {
    const vid = items.find((m) => m.type === "video");
    return (
      <div
        style={{ marginTop: 8, borderRadius: 8, overflow: "hidden" }}
        
        onClick={(e) => e.preventDefault()}
      >
        <video
          src={vid.url}
          controls
          style={{ width: "100%", display: "block" }}
        />
      </div>
    );
  }

  const single = items.length === 1;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: single ? "1fr" : "1fr 1fr",
        gap: 6,
        marginTop: 8,
      }}
    >
      {items.slice(0, 4).map((m, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: single ? "16 / 9" : "1 / 1",
            overflow: "hidden",
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#f8f8f8",
          }}
        >
          <img
            src={m.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onClick={(e) => e.preventDefault()} // avoid navigation when clicking image
          />
        </div>
      ))}
    </div>
  );
}


const TweetCard = ({ tweet, isRetweeted }) => {
  // If this is a retweet, prefer media from the original tweet
  const mediaFrom =
    (tweet?.media && tweet.media.length > 0 && tweet.media) ||
    (tweet?.type === "retweet" && tweet?.originalTweet?.media) ||
    [];

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

        {/* 🔽 media (images grid or single video) */}
        <TweetMedia media={mediaFrom} />

        <TweetIcons tweet={tweet} className={isRetweeted && "display-none"} />
      </div>
    </Link>
  );
};

export default TweetCard;
