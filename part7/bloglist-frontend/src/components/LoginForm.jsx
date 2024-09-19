import { useField } from "../hooks/useField";
import Notification from "./Notification";
import { authLogin } from "../reducers/authReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField("text");
  const { reset: resetPassword, ...password } = useField("text");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(authLogin(username.value, password.value));
    resetUsername();
    resetPassword();
    navigate("/");
  };

  return (
    <>
      <h1>log in to application</h1>
      <Notification />
      {/* {messageContent !== "" ? (
        <Notification type={messageType} message={messageContent} />
      ) : (
        <></>
      )} */}
      <form onSubmit={handleSubmit}>
        <div>
          username <input data-testid="username" {...username} />
        </div>
        <div>
          password <input data-testid="password" {...password} />
        </div>
        <button data-testid="login-button" type="submit">
          login
        </button>
      </form>
    </>
  );
};
export default LoginForm;
