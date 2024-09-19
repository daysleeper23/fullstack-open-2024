import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
// import { successNotification, errorNotification } from "./notificationReducer";

const initialState = [];

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // likeBlog(state, action) {
    //   const id = action.payload;
    //   const curBlog = state.find((a) => a.id === id);
    //   const updBlog = { ...curBlog, likes: curBlog.likes + 1 };

    //   console.log("like", id);
    //   return state.map((a) => (a.id === id ? updBlog : a));
    // },
    // appendBlog(state, action) {
    //   state.push(action.payload);
    // },
    // removeBlog(state, action) {
    //   const id = action.payload;
    //   const index = state.findIndex((a) => a.id === id);
    //   state.splice(index, 1);
    //   return state;
    // },
    setUsers(_state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

// export const createBlog = (blog) => {
//   return async (dispatch) => {
//     try {
//       const savedBlog = await userservice.createNew(blog);
//       console.log("saved:", savedBlog);

//       if (savedBlog) {
//         dispatch(appendBlog(savedBlog));
//         dispatch(
//           successNotification(
//             `a new blog ${blog.title} by ${blog.author} added`,
//             5,
//           ),
//         );
//       }
//     } catch (exception) {
//       dispatch(errorNotification(`Error while creating blog`, 5));
//     }
//   };
// };

// export const updateBlog = (updatedBlog) => {
//   return async (dispatch) => {
//     try {
//       console.log("updated", updatedBlog);
//       await userservice.updateOne(updatedBlog, updatedBlog.id);
//       dispatch(likeBlog(updatedBlog.id));
//     } catch (exception) {
//       dispatch(errorNotification(`Error while updating blog`, 5));
//     }
//   };
// };

// export const deleteBlog = (id) => {
//   return async (dispatch) => {
//     try {
//       console.log("deleted", id);
//       await userservice.deleteOne(id);
//       dispatch(removeBlog(id));
//     } catch (exception) {
//       dispatch(errorNotification(`Error while deleting blog`, 5));
//     }
//   };
// };

export const initializeUsers = () => {
  return async (dispatch) => {
    console.log('initialize users')
    const users = await userService.getAll();
    users.sort((a, b) => {
      if (b.id >= a.id) return 1;
      else return -1;
    });
    dispatch(setUsers(users));
  };
};

export default userSlice.reducer;
