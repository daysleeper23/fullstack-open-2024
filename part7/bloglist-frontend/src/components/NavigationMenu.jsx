import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { userLogout } from "../reducers/userReducer";
import { Link } from "react-router-dom";

export const NavigationMenu = () => {
  const style = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginBottom: 5,
    backgroundColor: "#d3d3d3",
  };

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
      <p style={style}>
        <Link to="/"> blogs </Link>
        <Link to="/users"> users </Link>
        {user.name} logged in
        <button data-testid="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
    </>
  );
};
export default NavigationMenu;
