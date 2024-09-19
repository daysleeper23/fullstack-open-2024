import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const initialState = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveAuth(state, action) {
      console.log("save:", action);
      state = action.payload;
      return state;
    },
    removeAuth(state, action) {
      console.log("remove:", action);
      state = null;
      return state;
    },
  },
});

export const { saveAuth, removeAuth } = authSlice.actions;

export const authLogin = (username, password) => {
  console.log("user login: ", username, password);
  return async (dispatch) => {
    try {
      const auth = await loginService.login(username, password);
      console.log("after login", auth);
      dispatch(saveAuth(auth));
    } catch (exception) {}
  };
};

export const authLogout = () => {
  console.log("logout");
  return async (dispatch) => {
    dispatch(removeAuth());
  };
};
export default authSlice.reducer;
