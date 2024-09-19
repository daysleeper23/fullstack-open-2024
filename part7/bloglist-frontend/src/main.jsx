import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "./index.css";

import notificationReducer from "./reducers/notificationReducer";
import authReducer from "./reducers/authReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";

import { BrowserRouter as Router } from "react-router-dom";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    auth: authReducer,
    blogs: blogReducer,
    users: userReducer
  },
});

console.log(store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
);
