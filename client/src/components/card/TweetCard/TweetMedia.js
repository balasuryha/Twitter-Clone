export default function TweetMedia({ media = [] }) {
  if (!media?.length) return null;

  const video = media.find((m) => m.type === "video");
  if (video) {
    return (
      <div className="tweet-card__media">
        <video className="tweet-card__video" controls src={video.url} />
      </div>
    );
  }

  const images = media.filter((m) => m.type === "image");
  return (
    <div className="tweet-card__grid">
      {images.map((m, i) => (
        <div key={i} className="tweet-card__imgwrap">
          <img src={m.url} alt="" />
        </div>
      ))}
    </div>
  );
}
