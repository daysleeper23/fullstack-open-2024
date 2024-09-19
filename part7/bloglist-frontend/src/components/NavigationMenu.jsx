import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { authLogout } from "../reducers/authReducer";
import { Link } from "react-router-dom";

export const NavigationMenu = () => {
  const style = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginBottom: 5,
    backgroundColor: "#d3d3d3",
  };

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // ============================================================
  // SECTION: Logout Process
  // ============================================================
  const handleLogout = async (e) => {
    e.preventDefault();
    blogService.setToken("");
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(""));
    dispatch(authLogout());
  };

  return (
    <>
      <p style={style}>
        <Link to="/"> blogs </Link>
        <Link to="/users"> users </Link>
        {auth.name} logged in
        <button data-testid="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
    </>
  );
};
export default NavigationMenu;
