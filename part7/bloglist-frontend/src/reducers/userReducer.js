import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const initialState = [];

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(_state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    console.log("initialize users");
    const users = await userService.getAll();
    users.sort((a, b) => {
      if (b.id >= a.id) return 1;
      else return -1;
    });
    dispatch(setUsers(users));
  };
};

export default userSlice.reducer;
