const Notification = ({ message }) => {
  return (
    <>
      {
      message === '' ? '' : <p>a new anecdote {message} created!</p>
      }
    </>
  )
}
export default Notification