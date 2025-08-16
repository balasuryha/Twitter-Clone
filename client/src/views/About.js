import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-page" style={page}>
      <header style={hero}>
       
        <Link to="/" aria-label="Close and go home" style={closeBtn} title="Close">
          ×
        </Link>

        <h1 style={h1}>Twitter-Clone — Project Overview</h1>
        <p style={lead}>
          This project is a learning clone of X/Twitter. It focuses on core
          social features: creating posts, uploading media, interacting with
          tweets, and managing profiles with a following feed.
        </p>
      </header>

      <section style={card}>
        <h2 style={h2}>What you can do</h2>
        <ul style={list}>
          <li>Post text tweets (up to <b>280</b> characters).</li>
          <li>Attach <b>up to 4 images</b> to a tweet.</li>
          <li>Attach <b>1 video</b> (MP4/WebM) to a tweet.</li>
          <li><b>Like</b> and <b>unlike</b> tweets.</li>
          <li><b>Reply</b> to tweets and <b>retweet</b> them.</li>
          <li><b>Bookmark</b> tweets to view later.</li>
          <li>Edit profile: avatar, bio, website, and location.</li>
          <li><b>Follow/Unfollow</b> people and see a personalized feed.</li>
          <li>Use <code>#hashtags</code> and <code>@mentions</code> in text.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>How posting works (high level)</h2>
        <ol style={list}>
          <li>Optionally upload images (max 4) or one video; the server returns public URLs.</li>
          <li>Create a tweet with text and those media URLs.</li>
          <li>Tweets show up in the global feed and in followers’ feeds.</li>
          <li>Other users can like, reply, and retweet.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={h2}>Key API endpoints (for reference)</h2>
        <ul style={monoList}>
          <li>POST <code>/uploads-api/image</code> • POST <code>/uploads-api/video</code></li>
          <li>POST <code>/tweet/new</code> • GET <code>/tweet?page=1</code></li>
          <li>GET <code>/tweet/following?page=1</code> • GET <code>/tweet/profile?username=…</code></li>
          <li>POST <code>/tweet/like/:id</code> • PATCH <code>/tweet/unlike/:id</code></li>
          <li>POST <code>/tweet/reply/new/:id</code> • POST <code>/tweet/retweet/:id</code></li>
          <li>PATCH <code>/tweet/edit/:id</code> • DELETE <code>/tweet/delete/:id</code></li>
          <li>Auth: POST <code>/profile/sign-in</code> • <code>/sign-up</code> • <code>/sign-out</code></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>Data model (simplified)</h2>
        <div style={grid}>
          <div>
            <h3 style={h3}>Profile</h3>
            <ul style={list}>
              <li><code>username</code>, <code>email</code>, <code>password</code> (hashed)</li>
              <li><code>avatar</code>, <code>bio</code>, <code>website</code>, <code>location</code></li>
              <li><code>tweets[]</code>, <code>followers[]</code>, <code>following[]</code></li>
              <li><code>bookmarks[]</code>, <code>notifications[]</code></li>
            </ul>
          </div>
          <div>
            <h3 style={h3}>Tweet</h3>
            <ul style={list}>
              <li><code>type</code>: "tweet" | "retweet" | "reply"</li>
              <li><code>body</code> (text ≤ 280 chars)</li>
              <li><code>media[]</code>: <code>{'{ type: "image|video", url }'}</code></li>
              <li><code>author</code> (Profile ref), <code>likes[]</code>, <code>replies[]</code>, <code>retweets[]</code></li>
              <li><code>hashtags[]</code>, <code>mentions[]</code></li>
              <li>Timestamps: <code>createdAt</code>, <code>updatedAt</code></li>
            </ul>
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>Constraints & limits</h2>
        <ul style={list}>
          <li>Either images (≤4) <i>or</i> one video per tweet (not both together).</li>
          <li>Image size: ~5MB each; Video size: ~50MB (configurable).</li>
          <li>Hashtags support Unicode letters/numbers; mentions are case-insensitive.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>Tech stack</h2>
        <ul style={list}>
          <li>React (Router v5), Redux, Axios</li>
          <li>Node.js + Express, Multer for uploads</li>
          <li>MongoDB + Mongoose (schema methods, autopopulate)</li>
          <li>JWT in httpOnly cookies, CORS (credentials)</li>
          <li>Password hashing with <code>bcryptjs</code></li>
        </ul>
      </section>

      <footer style={{ ...card, textAlign: "center", color: "#6b7280" }}>
        <p>Built for learning; not affiliated with Twitter/X.</p>
      </footer>

      <style>{`
        .about-page h1, .about-page h2, .about-page h3, .about-page p,
        .about-page li, .about-page code { color: #0f172a; }
        .about-page code { background:#f3f4f6; padding:2px 6px; border-radius:6px; }
      `}</style>
    </main>
  );
}


const page = { maxWidth: 980, margin: "0 auto", padding: "24px 16px" };
const hero = { position: "relative", padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#ffffff" };
const card = { marginTop: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#ffffff" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16 };
const h1 = { margin: 0, fontSize: 28, fontWeight: 800 };
const h2 = { margin: "0 0 10px 0", fontSize: 20, fontWeight: 700 };
const h3 = { margin: "0 0 6px 0", fontSize: 16, fontWeight: 700 };
const lead = { margin: "8px 0 0 0", color: "#374151", lineHeight: 1.6 };
const list = { margin: 0, paddingLeft: 18, lineHeight: 1.6 };
const monoList = { ...list, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };

/* close button style */
const closeBtn = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 36,
  height: 36,
  borderRadius: 9999,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: 22,
  lineHeight: 1,
  boxShadow: "0 1px 2px rgba(0,0,0,.05)",
  cursor: "pointer"
};
