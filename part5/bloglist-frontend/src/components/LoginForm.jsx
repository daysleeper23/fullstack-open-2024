const LoginForm = ({ username, password, usernameHandler, passwordHandler, loginHandler }) => {
  return (
    <>
      <h1>log in to application</h1>
      <form onSubmit={loginHandler}>
        <div>
          username <input type='text' value={username} onChange={usernameHandler} />
        </div>
        <div>
          password <input type='password' value={password} onChange={passwordHandler} />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
    
  )
}
export default LoginForm