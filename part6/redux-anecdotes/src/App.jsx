import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch({ type: 'VOTE', payload: { id: id }})
  }

  const create = (event) => {
    event.preventDefault()

    console.log('create', event.target.anecdote.value)
    dispatch({ type: 'NEW', payload: { content: event.target.anecdote.value }})

    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes
        .sort((a, b) => {
          if (b.votes > a.votes) return 1
          if (b.votes < a.votes) return -1

          if (b.id >= a.id) return 1
          else return -1
        })
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default App