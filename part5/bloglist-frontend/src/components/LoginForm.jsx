import Notification from './Notification'

const LoginForm = ({
  username, password,
  usernameHandler, passwordHandler, loginHandler,
  messageType, messageContent
}) => {
  return (
    <>
      <h1>log in to application</h1>
      {messageContent !== ''
        ? <Notification type={messageType} message={messageContent} />
        : <></>
      }
      <form onSubmit={loginHandler}>
        <div>
          username <input data-testid='username' type='text' value={username} onChange={usernameHandler} />
        </div>
        <div>
          password <input data-testid='password' type='password' value={password} onChange={passwordHandler} />
        </div>
        <button data-testid='login-button' type='submit'>login</button>
      </form>
    </>
  )
}
export default LoginForm