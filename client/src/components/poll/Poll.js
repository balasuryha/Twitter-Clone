import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { votePoll } from "../../redux/actions/tweetActions";

export default function Poll({ tweet }) {
  const dispatch = useDispatch();
  const currentUserId = useSelector(s => s.currentProfile.data?._id);

  // local copy so we can update immediately after a vote
  const [poll, setPoll] = useState(tweet.poll);
  const [locked, setLocked] = useState(false); // lock after a successful vote

  useEffect(() => {
    setPoll(tweet.poll);
  }, [tweet.poll]);

  const expired = poll?.expiresAt ? new Date(poll.expiresAt) < new Date() : false;

  // ✅ robust "already voted" check (works for string ids AND populated objects)
  const alreadyVoted = useMemo(() => {
    const voters = poll?.voters || [];
    return voters.some(v => String(v && v._id ? v._id : v) === String(currentUserId));
  }, [poll, currentUserId]);

  const totalVotes = useMemo(
    () => (poll?.options || []).reduce((sum, o) => sum + (o.votes || 0), 0),
    [poll]
  );

  // show results if poll expired, if user already voted, or after we lock post-vote
  const showResults = expired || alreadyVoted || locked;

  const handleVote = async (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (showResults) return; // don't let them vote again / after expiry

    const res = await dispatch(votePoll({ tweetId: tweet._id, optionIndex: idx }));
    const status = res?.payload?.status;
    const updated = res?.payload?.data?.poll;

    // success -> update and lock
    if (status >= 200 && status < 300 && updated) {
      setPoll(updated);
      setLocked(true);
      return;
    }

    // already voted / expired / other server messages that return current poll
    if ((status === 409 || status === 400 || status === 404) && updated) {
      setPoll(updated);
      setLocked(true);
      return;
    }
  };

  const blockLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!poll) return null;

  return (
    <div className="poll" onClick={blockLink} style={{ marginTop: 8 }}>
      <div className="poll__question" style={{ fontWeight: 600, marginBottom: 8 }}>
        {poll.question}
      </div>

      <div className="poll__options" style={{ display: "grid", gap: 6 }}>
        {poll.options.map((opt, idx) => {
          const votes = opt.votes || 0;
          const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <button
              key={idx}
              onClick={(e) => handleVote(idx, e)}
              disabled={showResults}
              className="poll__option"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid var(--border, #2f3336)",
                cursor: showResults ? "default" : "pointer",
                opacity: showResults ? 0.9 : 1
              }}
            >
              <span>{opt.text}</span>
              {showResults && (
                <span style={{ float: "right", opacity: 0.8 }}>
                  {pct}% ({votes})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="poll__meta" style={{ marginTop: 6, opacity: 0.75, fontSize: 12 }}>
        {expired ? "Poll ended" : "Poll active"} • {totalVotes} votes
      </div>
    </div>
  );
}
