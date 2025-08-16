import React, { useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiImage, RiFileGifLine, GrEmoji } from "react-icons/all";
import TextareaAutosize from "react-textarea-autosize";
import Avatar from "../avatar/Avatar";
import { newTweet } from "../../redux/actions/tweetActions";
import { uploadImages, uploadVideo } from "../../api/requests/upload";

const NewTweetForm = () => {
  const { username, avatar } = useSelector((s) => s.currentProfile.data || {});
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [imgFiles, setImgFiles] = useState([]);      // File[]
  const [videoFile, setVideoFile] = useState(null);  // File|null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);

  const imgPreviews = useMemo(() => imgFiles.map(f => URL.createObjectURL(f)), [imgFiles]);
  const videoPreview = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : null), [videoFile]);

  // ---- pickers ----
  const onPickImages = (e) => {
    setError("");
    if (videoFile) { setError("Remove the video to add images."); e.target.value = ""; return; }
    const selected = Array.from(e.target.files || []);
    const imgs = selected.filter(f => /^image\/(png|jpe?g|gif|webp)$/i.test(f.type));
    setImgFiles(prev => [...prev, ...imgs].slice(0, 4));
    e.target.value = "";
  };

  const onPickVideo = (e) => {
    setError("");
    if (imgFiles.length) { setError("Remove images to add a video."); e.target.value = ""; return; }
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^video\/(mp4|webm)$/i.test(f.type)) { setError("Only MP4 or WebM videos are allowed."); e.target.value = ""; return; }
    const MAX_MB = 50;
    if (f.size > MAX_MB * 1024 * 1024) { setError(`Video is larger than ${MAX_MB}MB.`); e.target.value = ""; return; }
    setVideoFile(f);
    e.target.value = "";
  };

  const removeImageAt = (i) => setImgFiles(prev => prev.filter((_, idx) => idx !== i));
  const removeVideo = () => setVideoFile(null);

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const hasText = !!text.trim();
    const hasImages = imgFiles.length > 0;
    const hasVideo = !!videoFile;

    if (!hasText && !hasImages && !hasVideo) { setError("Write something or add media."); return; }
    if (text.length > 280) { setError("Max 280 characters."); return; }

    setLoading(true);
    try {
      let media = [];

      if (hasVideo) {
        const url = await uploadVideo(videoFile);           // returns string
        media = [{ type: "video", url }];
      } else if (hasImages) {
        const urls = await uploadImages(imgFiles);          // returns [string]
        media = urls.map(u => ({ type: "image", url: u }));
      }

      await dispatch(newTweet({ body: text.trim(), media }));
      setText(""); setImgFiles([]); setVideoFile(null);
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || err?.message
        || "Failed to post";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tweet-form display-flex align-items-fs">
      <div className="tweet-form__img display-flex justify-content-c align-items-c">
        <Avatar username={username} avatar={avatar} size="small" />
      </div>

      <form className="tweet-form__form" onSubmit={handleSubmit}>
        <TextareaAutosize
          name="body"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          placeholder="What's happening?"
        />

        {/* image previews */}
        {imgPreviews.length > 0 && (
          <div className="tweet-form__media-grid">
            {imgPreviews.map((src, i) => (
              <div key={i} className="tweet-form__thumb">
                <img src={src} alt="" />
                <button
                  type="button"
                  className="tweet-form__thumb-x"
                  onClick={() => removeImageAt(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* video preview */}
        {videoPreview && (
          <div className="tweet-form__thumb" style={{ aspectRatio: "16/9" }}>
            <video src={videoPreview} controls style={{ width: "100%", height: "100%", borderRadius: 8 }} />
            <button type="button" className="tweet-form__thumb-x" onClick={removeVideo} aria-label="Remove video">×</button>
          </div>
        )}

        <div className="display-flex justify-content-sb align-items-c">
          <ul className="display-flex">
            {/* FiImage → images (unchanged icon) */}
            <li title="Add images" style={{ opacity: videoFile ? 0.5 : 1 }}>
              <label style={{ cursor: videoFile ? "not-allowed" : "pointer", display: "inline-flex" }}>
                <FiImage />
                <input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onPickImages}
                  disabled={!!videoFile}
                />
              </label>
            </li>

            {/* RiFileGifLine → video/GIF (unchanged icon) */}
            <li title="Add video" style={{ marginLeft: 12, opacity: imgFiles.length ? 0.5 : 1 }}>
              <label style={{ cursor: imgFiles.length ? "not-allowed" : "pointer", display: "inline-flex" }}>
                <RiFileGifLine />
                <input
                  ref={vidInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  hidden
                  onChange={onPickVideo}
                  disabled={imgFiles.length > 0}
                />
              </label>
            </li>

            {/* GrEmoji (placeholder, unchanged) */}
            <li style={{ marginLeft: 12 }}>
              <span className="icon-emoji" title="Emoji">
                <GrEmoji />
              </span>
            </li>
          </ul>

          <button
            className="tweet-form__btn"
            disabled={loading || (!text.trim() && !imgFiles.length && !videoFile)}
          >
            {loading ? "Posting…" : "Tweet"}
          </button>
        </div>

        {error && <div className="tweet-form__error">{error}</div>}
      </form>
    </div>
  );
};

export default NewTweetForm;
