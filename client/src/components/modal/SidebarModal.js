// components/modal/SidebarModal.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom"; // ⬅️ useHistory (v5)
import { signOut } from "../../redux/actions/currentProfileActions";
import ChangePasswordModal from "./ChangePasswordModal";

function SidebarModal() {
  const isOpened = useSelector((s) => s.modal.sidebarModal);
  const { data } = useSelector((s) => s.currentProfile);
  const dispatch = useDispatch();
  const history = useHistory();                         // ⬅️

  const [showPwdModal, setShowPwdModal] = useState(false);

  if (!data) return <Redirect to="/signin" />;

  return (
    <>
      <div className={`sidebar-left__modal ${isOpened ? "opened" : ""} display-flex flex-direction-c`}>
        <button
          type="button"
          className="sidebar-left__modal-btn"
          onClick={() => history.push("/edit")}         // ⬅️ navigate on click
        >
          Edit profile
        </button>

        <button
          type="button"
          className="sidebar-left__modal-btn"
          onClick={() => setShowPwdModal(true)}
        >
          Change password
        </button>

        <button
          type="button"
          className="sidebar-left__modal-btn"
          onClick={() => dispatch(signOut())}
        >
          Sign out
        </button>
      </div>

      <ChangePasswordModal open={showPwdModal} onClose={() => setShowPwdModal(false)} />
    </>
  );
}

export default SidebarModal;
