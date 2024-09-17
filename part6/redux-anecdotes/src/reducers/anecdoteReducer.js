import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setVoteNotification, setCreateNotification } from './notificationReducer'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const curAnecdote = state.find(a => a.id === id)
      const updAnecdote = { ...curAnecdote, votes: curAnecdote.votes + 1 }

      console.log(current(state))
      return state.map(a => a.id === id ? updAnecdote : a)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(_state, action) {
      return action.payload
    }
  }
})

export const createAnecdote = content => {
  return async dispatch => {
    try {
      const savedAnecdote = await anecdoteService.create(content)
      console.log('saved:', savedAnecdote)

      if (savedAnecdote) {
        dispatch(appendAnecdote(savedAnecdote))
        dispatch(setCreateNotification(content, 5))
      }
    }
    catch (exception) {
  
    }
  }
}

export const updateAnecdote = newAnecdote => {
  return async dispatch => {
    try {
      await anecdoteService.update(newAnecdote)
      console.log('updated', newAnecdote)
      dispatch(voteAnecdote(newAnecdote.id))
      dispatch(setVoteNotification(newAnecdote.content, 5))
    }
    catch (exception) {
  
    }
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer