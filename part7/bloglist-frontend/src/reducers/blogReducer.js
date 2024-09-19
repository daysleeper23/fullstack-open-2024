import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { successNotification, errorNotification } from "./notificationReducer";

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    likeBlog(state, action) {
      const id = action.payload;
      const curBlog = state.find((a) => a.id === id);
      const updBlog = { ...curBlog, likes: curBlog.likes + 1 };

      console.log("like", id);
      return state.map((a) => (a.id === id ? updBlog : a));
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const id = action.payload;
      const index = state.findIndex((a) => a.id === id);
      state.splice(index, 1);
      return state;
    },
    setBlogs(_state, action) {
      return action.payload;
    },
  },
});

export const { likeBlog, appendBlog, removeBlog, setBlogs } = blogSlice.actions;

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const savedBlog = await blogService.createNew(blog);
      console.log("saved:", savedBlog);

      if (savedBlog) {
        dispatch(appendBlog(savedBlog));
        dispatch(
          successNotification(
            `a new blog ${blog.title} by ${blog.author} added`,
            5,
          ),
        );
      }
    } catch (exception) {
      dispatch(errorNotification(`Error while creating blog`, 5));
    }
  };
};

export const updateBlog = (updatedBlog) => {
  return async (dispatch) => {
    try {
      console.log("updated", updatedBlog);
      await blogService.updateOne(updatedBlog, updatedBlog.id);
      dispatch(likeBlog(updatedBlog.id));
    } catch (exception) {
      dispatch(errorNotification(`Error while updating blog`, 5));
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      console.log("deleted", id);
      await blogService.deleteOne(id);
      dispatch(removeBlog(id));
    } catch (exception) {
      dispatch(errorNotification(`Error while deleting blog`, 5));
    }
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    console.log('initialize blogs')
    const blogs = await blogService.getAll();
    blogs.sort((a, b) => {
      if (b.likes > a.likes) return 1;
      if (b.likes < a.likes) return -1;

      if (b.id >= a.id) return 1;
      else return -1;
    });
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;
