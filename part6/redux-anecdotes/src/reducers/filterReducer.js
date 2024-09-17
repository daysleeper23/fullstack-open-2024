const filterReducer = (state = '', action) => {
  console.log('state now: ', state)
  console.log('action', action)
  
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}

export const createFilter = (content) => {
  return {
    type: 'SET',
    payload: content
  }
}

export default filterReducer