import { useNotiValue } from '../NotificationContext'

const Notification = () => {
  const noti = useNotiValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <>
      {noti === '' ? <></> : <div style={style}>{noti}</div>}
    </>
  )
}

export default Notification
