import React, { useState } from "react";
import { editProfile } from "../../redux/actions/currentProfileActions";
import getFormData from "../../utils/getFormData";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChangePasswordModal from "../modal/ChangePasswordModal"; // ⬅️ NEW

const UpdateProfileForm = () => {
  const { fname, lname, bio, location, website, username } = useSelector(
    (state) => state.currentProfile.data
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [showPwdModal, setShowPwdModal] = useState(false); // ⬅️ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = getFormData(e.target);
    await dispatch(editProfile(formData));
    history.push(`/profile/${username}`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="auth__form display-flex align-items-c justify-content-c flex-direction-c"
      >
        <input type="text" name="fname" placeholder="First name" defaultValue={fname} />
        <input type="text" name="lname" placeholder="Last name" defaultValue={lname} />
        <input type="text" name="location" placeholder="Location" defaultValue={location} />
        <input type="text" name="website" placeholder="Website" defaultValue={website} />
        <input type="text" name="bio" placeholder="Bio" defaultValue={bio} />
        {/* <button
          type="button"
          onClick={() => setShowPwdModal(true)}
          className="as-input-btn"
        >
          Change password
        </button> */}
        {/* Save profile */}
        <input type="submit" value="Save" />

        {/* Change password trigger directly beneath Bio/Save */}
        
      </form>

      {/* Centered modal */}
      {/* <ChangePasswordModal
        open={showPwdModal}
        onClose={() => setShowPwdModal(false)}
      /> */}
    </>
  );
};

export default UpdateProfileForm;
