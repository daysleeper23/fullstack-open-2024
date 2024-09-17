import deepFreeze from 'deep-freeze'
import anecdoteReducer from '../reducers/anecdoteReducer'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

describe('anecdote reducer', () => {
  test('should return a proper initial state when called with undefined state', () => {
    const state = initialState
    const action = {
      type: 'anecdotes/DO_NOTHING',
      payload: 'nothing'
    }

    deepFreeze(state)
    const newState = anecdoteReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  // test('good is incremented', () => {
  //   const action = {
  //     type: 'GOOD'
  //   }
  //   const state = initialState

  //   deepFreeze(state)
  //   const newState = counterReducer(state, action)
  //   expect(newState).toEqual({
  //     good: 1,
  //     ok: 0,
  //     bad: 0
  //   })
  // })

  // test('ok is incremented', () => {
  //   const action = {
  //     type: 'OK'
  //   }
  //   const state = initialState

  //   deepFreeze(state)
  //   const newState = counterReducer(state, action)
  //   expect(newState).toEqual({
  //     good: 0,
  //     ok: 1,
  //     bad: 0
  //   })
  // })

  // test('bad is incremented', () => {
  //   const action = {
  //     type: 'BAD'
  //   }
  //   const state = initialState

  //   deepFreeze(state)
  //   const newState = counterReducer(state, action)
  //   expect(newState).toEqual({
  //     good: 0,
  //     ok: 0,
  //     bad: 1
  //   })
  // })

  // test('reset when zero', () => {
  //   const action = {
  //     type: 'ZERO'
  //   }
  //   const state = initialState

  //   deepFreeze(state)
  //   const newState = counterReducer(state, action)
  //   expect(newState).toEqual(initialState)
  // })
})