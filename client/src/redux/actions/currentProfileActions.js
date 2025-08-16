import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/requests/auth";
import * as profileApi from "../../api/requests/profile";

export const signIn = createAsyncThunk(
  "currentProfile/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(formData);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const signUp = createAsyncThunk(
  "currentProfile/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(formData);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const signOut = createAsyncThunk(
  "currentProfile/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.signout();
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getCurrentProfile = createAsyncThunk(
  "currentProfile/getCurrentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getCurrentProfile();
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addBookmark = createAsyncThunk(
  "currentProfile/addBookmark",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await profileApi.addBookmark(tweetId);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "currentProfile/removeBookmark",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await profileApi.removeBookmark(tweetId);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const editProfile = createAsyncThunk(
  "currentProfile/editProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(formData);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "currentProfile/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await profileApi.uploadAvatar(formData);
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getBookmarks = createAsyncThunk(
  "currentProfile/getBookmarks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getBookmarks();
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const verifyPasswordThunk = createAsyncThunk(
  "currentProfile/verifyPassword",
  async (currentPassword) => {
    const res = await profileApi.verifyPassword(currentPassword);
    return res;
  }
);

export const changePasswordThunk = createAsyncThunk(
  "currentProfile/changePassword",
  async ({ currentPassword, newPassword, confirm }) => {
    const res = await profileApi.changePassword({ currentPassword, newPassword, confirm });
    return res;
  }
);