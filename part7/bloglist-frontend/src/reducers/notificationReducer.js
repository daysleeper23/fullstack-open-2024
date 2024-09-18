import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    success(state, action) {
      state = {
        type: "success",
        message: action.payload,
      };
      return state;
    },
    error(state, action) {
      state = {
        type: "error",
        message: action.payload,
      };
      return state;
    },
    remove(state, _action) {
      state = {
        type: "success",
        message: "",
      };
      return state;
    },
  },
});

export const { success, error, remove } = notificationSlice.actions;

export const successNotification = (content, duration) => {
  return async (dispatch) => {
    // console.log('vote noti', content, duration)
    dispatch(success(content));

    setTimeout(() => {
      dispatch(remove());
    }, duration * 1000);
  };
};

export const errorNotification = (content, duration) => {
  return async (dispatch) => {
    // console.log('vote noti', content, duration)
    dispatch(error(content));

    setTimeout(() => {
      dispatch(remove());
    }, duration * 1000);
  };
};

export default notificationSlice.reducer;
