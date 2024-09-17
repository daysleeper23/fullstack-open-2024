import { createContext, useReducer, useContext } from 'react'

const initialState = ''

const notiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE':
      console.log('action', action)
      // console.log('create noti', action.payload)
      return `anecdote ${action.payload} created`
    case 'VOTE':
      // console.log('vote noti', action.payload)
      return `anecdote ${action.payload} voted`
    case 'SHORT':
      console.log('into short')
      return 'too short anecdote, must have length 5 or more'
    case 'REMOVE':
      return initialState
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [noti, notiDispatch] = useReducer(notiReducer, '')

  return (
    <NotificationContext.Provider value={[noti, notiDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotiValue = () => {
  const notiAndDispatch = useContext(NotificationContext)
  return notiAndDispatch[0]
}

export const useNotiDispatch = () => {
  const notiAndDispatch = useContext(NotificationContext)
  return notiAndDispatch[1]
}

export default NotificationContext

