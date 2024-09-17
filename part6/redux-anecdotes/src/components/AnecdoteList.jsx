import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setVoteNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
    dispatch(setVoteNotification(content))

    setTimeout(() => {
      dispatch(removeNotification()) 
    }, 5000)
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
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
        )}
    </>
  )
}
export default AnecdoteList