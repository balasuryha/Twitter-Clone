// components/card/ProfileCard.jsx
import React, { useState } from "react";
import FollowBtn from "../button/FollowBtn";
import { BsCalendar3, ImLink, MdLocationOn } from "react-icons/all";
import EditBtn from "../button/EditBtn";
import getDate from "../../utils/getDate";
import Avatar from "../avatar/Avatar";
import FollowListModal from "../modal/FollowListModal"; // ⬅️ NEW

function ProfileCard({ profile, currentProfile }) {
  const { username, avatar, followers = [], following = [], createdAt } = profile;

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <div className="profile-card">
      <div className="profile-card__banner">
        <img
          src="https://data.whicdn.com/images/335288936/original.jpg"
          alt="banner"
        />
      </div>

      <div className="profile-card__bio">
        <div className="display-flex align-items-c justify-content-sb">
          <div className="profile-card__bio--img display-flex justify-content-c align-items-c">
            <Avatar size="large" username={username} avatar={avatar} />
          </div>
          {currentProfile ? (
            <EditBtn />
          ) : (
            <FollowBtn username={username} followers={followers} />
          )}
        </div>

        <h3>{profile.fname}</h3>
        <small>@{profile.username}</small>
        <p>{profile.bio}</p>

        <ul className="display-flex">
          <li className="display-flex align-items-c">
            <MdLocationOn /> {profile.location}
          </li>
          <li className="display-flex align-items-c">
            <ImLink />
            <a href={profile.website}>{profile.website}</a>
          </li>
          <li className="display-flex align-items-c">
            <BsCalendar3 /> Joined {getDate(createdAt)}
          </li>
        </ul>

        {/* clickable counts */}
        <div className="profile-card__bio--follow display-flex" style={{ gap: 16 }}>
          <button
            type="button"
            onClick={() => setShowFollowing(true)}
            style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
            title="View following"
          >
            <span>{following.length}</span> Following
          </button>

          <button
            type="button"
            onClick={() => setShowFollowers(true)}
            style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
            title="View followers"
          >
            <span>{followers.length}</span> Followers
          </button>
        </div>
      </div>

      <div className="profile-card__tweets display-flex justify-content-c">
        Tweets
      </div>

      {/* Modals */}
      <FollowListModal
        open={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
        users={following}
      />
      <FollowListModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        users={followers}
      />
    </div>
  );
}

export default ProfileCard;
