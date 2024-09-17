import { createSlice } from "@reduxjs/toolkit"

const initialState = ''
const votePrefix = 'you voted '
const createPrefix = 'you created '

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setVoteNotification(state, action) {
      state = votePrefix + `'` + action.payload + `'`
      return state
    },
    setCreateNotification(state, action) {
      state = state = createPrefix + `'` + action.payload + `'`
      return state
    },
    removeNotification(state, _action) {
      state = initialState
      return state
    }
  }
})

export const { setVoteNotification, setCreateNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer