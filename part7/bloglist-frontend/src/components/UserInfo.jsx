import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { userLogout } from "../reducers/userReducer";

export const UserInfo = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ============================================================
  // SECTION: Logout Process
  // ============================================================
  const handleLogout = async (e) => {
    e.preventDefault();
    blogService.setToken("");
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(""));
    dispatch(userLogout());
  };

  return (
    <>
      {user ? (
        <p>
          {user.name} logged in
          <button data-testid="logout-button" onClick={handleLogout}>
            logout
          </button>
        </p>
      ) : (
        ""
      )}
    </>
  );
};
export default UserInfo;
