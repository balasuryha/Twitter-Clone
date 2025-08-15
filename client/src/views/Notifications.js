// views/Notifications.jsx
import EnablePushButton from "../components/push/EnablePushButton";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// keeping your all-in-one icon import style for consistency
import {
  GoPerson,
  BsTwitter,
  AiOutlineRetweet,
  AiOutlineHeart,
} from "react-icons/all";
import { BiMessageDetail } from "react-icons/all";
import { getCurrentProfile } from "../redux/actions/currentProfileActions";

function Notifications() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.currentProfile);
  const notifications = data?.notifications || [];

  // Ensure we have fresh notifications when this page loads
  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  if (!notifications.length)
    return (
      <>
        <EnablePushButton />
        <div>No notifications yet</div>
      </>
    );

  return (
    <>
      <EnablePushButton />
      {notifications.map((n, idx) => {
        const line = (
          <>
            {n.actor?.username ? <strong>@{n.actor.username}</strong> : null}{" "}
            {n.message}
          </>
        );

        switch (n.type) {
          case "follow":
            return (
              <div key={idx} className="notification display-flex align-items-c">
                <GoPerson />
                <p>{line}</p>
              </div>
            );
          case "like":
            return (
              <div key={idx} className="notification display-flex align-items-c">
                <AiOutlineHeart />
                <p>{line}</p>
              </div>
            );
          case "retweet":
            return (
              <div key={idx} className="notification display-flex align-items-c">
                <AiOutlineRetweet />
                <p>{line}</p>
              </div>
            );
          case "reply":
            return (
              <div key={idx} className="notification display-flex align-items-c">
                <BiMessageDetail />
                <p>{line}</p>
              </div>
            );
          default:
            return (
              <div key={idx} className="notification display-flex align-items-c">
                <BsTwitter />
                <p>{n.message}</p>
              </div>
            );
        }
      })}
    </>
  );
}

export default Notifications;
