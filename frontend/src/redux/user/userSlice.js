import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    signoutUserFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  signInSuccess,
  signInFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserSuccess,
  signoutUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
