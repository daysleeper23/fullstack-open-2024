const Notification = ({ type, message }) => {

  if (message === '')
    return <></>
  else
    return (
      <div className={type}>
        {message}
      </div>  
  )
}
export default Notification