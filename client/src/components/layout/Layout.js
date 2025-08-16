import React from "react";
import SidebarLeft from "./SidebarLeft";
import Header from "./Header";
import MiniTweetBtn from "../button/MiniTweetBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebarModal,
  toggleTweetEditorModal,
} from "../../redux/slicers/modalSlicer";
import TweetModal from "../modal/TweetModal";

function Layout({ children }) {
  const dispatch = useDispatch();
  const { sidebarModal, tweetEditorModal } = useSelector(
    (state) => state.modal
  );

  const handleClick = () => {
    if (sidebarModal) dispatch(toggleSidebarModal());
    else if (tweetEditorModal) dispatch(toggleTweetEditorModal());
    else return;
  };
  return (
    <div
      onClick={() => handleClick()}
      className="layout display-flex justify-content-sb"
    >
      <SidebarLeft />
      <main id="main" className="main flex--2">
        <Header />
        {children}
      </main>
      <MiniTweetBtn />
     
      <TweetModal />
    </div>
  );
}

export default Layout;
