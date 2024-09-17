import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = async (id) => {
    const curAnecdote = anecdotes.find(a => a.id === id)
    console.log('vote', curAnecdote)

    if (curAnecdote) {
      const newAnecdote = {... curAnecdote, votes: curAnecdote.votes + 1}
      dispatch(updateAnecdote(newAnecdote))      
    }
  }

  return (
    <>
      {anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase() === 'ALL' ? '' : filter.toLowerCase()))
        .sort((a, b) => {
          if (b.votes > a.votes) return 1
          if (b.votes < a.votes) return -1

          if (b.id < a.id) return 1
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
    </>
  )
}
export default AnecdoteList