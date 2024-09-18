import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser(state, action) {
      console.log("save:", action);
      state = action.payload;
      return state;
    },
    removeUser(state, action) {
      console.log("remove:", action);
      state = null;
      return state;
    },
  },
});

export const { saveUser, removeUser } = userSlice.actions;

export const userLogin = (username, password) => {
  console.log("user login: ", username, password);
  return async (dispatch) => {
    try {
      const user = await loginService.login(username, password);
      console.log("after login", user);
      dispatch(saveUser(user));
    } catch (exception) {}
  };
};

export const userLogout = () => {
  console.log("logout");
  return async (dispatch) => {
    dispatch(removeUser());
  };
};
export default userSlice.reducer;
