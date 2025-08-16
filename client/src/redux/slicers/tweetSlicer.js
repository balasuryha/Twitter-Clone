// import { createSlice } from "@reduxjs/toolkit";
// import * as action from "../actions/tweetActions";

// export const tweetSlicer = createSlice({
//   name: "tweet",
//   initialState: {
//     loading: false,
//     allTweets: null,
//     followingTweets: null,
//     tweetById: null,
//     modifiedTweet: null,
//     newTweet: null,
//     newRetweet: null,
//     error: null,
//   },
//   extraReducers: {
//     [action.getAllTweets.pending]: (state) => {
//       state.loading = true;
//     },
//     [action.getFollowingTweets.pending]: (state) => {
//       state.loading = true;
//     },
//     [action.getTweetById.pending]: (state) => {
//       state.loading = true;
//     },
//     [action.getAllTweets.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.allTweets = data;
//       } else {
//         state.error = data;
//       }
//     },
//     [action.getFollowingTweets.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.followingTweets = data;
//       } else {
//         state.error = data;
//       }
//       state.loading = false;
//     },
//     [action.getTweetById.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.tweetById = data[0];
//       } else {
//         state.error = data;
//       }
//       state.loading = false;
//     },
//     [action.likeTweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.modifiedTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.unlikeTweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.modifiedTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.newRetweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.newRetweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.newTweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.newTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.newReply.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.newTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.deleteTweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.modifiedTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//     [action.editTweet.fulfilled]: (state, action) => {
//       const { status, data } = action.payload;
//       if (status === 200) {
//         state.modifiedTweet = data;
//       } else {
//         state.errors = data;
//       }
//     },
//   },
// });

// export default tweetSlicer.reducer;
import { createSlice } from "@reduxjs/toolkit";
import * as action from "../actions/tweetActions";

export const tweetSlicer = createSlice({
  name: "tweet",
  initialState: {
    loading: false,
    allTweets: null,
    followingTweets: null,
    tweetById: null,
    modifiedTweet: null,
    newTweet: null,
    newRetweet: null,
    error: null,
  },
  extraReducers: {
    // -------- pending
    [action.getAllTweets.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [action.getFollowingTweets.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [action.getTweetById.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.tweetById = null;
    },

    // -------- fulfilled
    [action.getAllTweets.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.allTweets = data;
      } else {
        state.error = data;
      }
      state.loading = false; // ✅ make sure loader stops
    },
    [action.getFollowingTweets.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.followingTweets = data;
      } else {
        state.error = data;
      }
      state.loading = false;
    },
    [action.getTweetById.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        // ✅ backend should return an object; keep fallback for array just in case
        state.tweetById = Array.isArray(data) ? data[0] : data;
      } else {
        state.error = data;
      }
      state.loading = false;
    },

    // -------- other mutations
    [action.likeTweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.modifiedTweet = data;
        // optional: update tweetById.likes if it matches
      } else {
        state.errors = data;
      }
    },
    [action.unlikeTweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.modifiedTweet = data;
      } else {
        state.errors = data;
      }
    },
    [action.newRetweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.newRetweet = data;
      } else {
        state.errors = data;
      }
    },
    [action.newTweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.newTweet = data;
      } else {
        state.errors = data;
      }
    },
    [action.newReply.fulfilled]: (state, action) => {
  const { status, data } = action.payload;
  if (status === 200) {
    state.newTweet = data;

    // ⬇️ show reply immediately
    if (state.tweetById && Array.isArray(state.tweetById.replies)) {
      state.tweetById.replies.unshift(data); // newest reply at top
    }
  } else {
    state.errors = data;
  }
}
,
    [action.deleteTweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.modifiedTweet = data;
      } else {
        state.errors = data;
      }
    },
    [action.editTweet.fulfilled]: (state, action) => {
      const { status, data } = action.payload;
      if (status === 200) {
        state.modifiedTweet = data;
      } else {
        state.errors = data;
      }
    },
  },
});

export default tweetSlicer.reducer;
