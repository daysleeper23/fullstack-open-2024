import { useField } from "../hooks/useField";
import Notification from "./Notification";
import { userLogin } from "../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField("text");
  const { reset: resetPassword, ...password } = useField("text");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(userLogin(username.value, password.value));
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
