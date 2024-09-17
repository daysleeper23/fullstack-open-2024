import { createSlice } from "@reduxjs/toolkit"

const initialState = ''
const votePrefix = 'you voted '
const createPrefix = 'you created '

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    vote(state, action) {
      state = votePrefix + `'` + action.payload + `'`
      return state
    },
    create(state, action) {
      state = state = createPrefix + `'` + action.payload + `'`
      return state
    },
    remove(state, _action) {
      state = initialState
      return state
    }
  }
})

export const { create, vote, remove } = notificationSlice.actions

export const setVoteNotification = (content, duration) => {
  return async dispatch => {
    // console.log('vote noti', content, duration)
    dispatch(vote(content))

    setTimeout(() => {
      dispatch(remove()) 
    }, duration * 1000)
  }
}

export const setCreateNotification = (content, duration) => {
  return async dispatch => {
    // console.log('create noti', content, duration)
    dispatch(create(content))

    setTimeout(() => {
      dispatch(remove()) 
    }, duration * 1000)
  }
}

export default notificationSlice.reducer