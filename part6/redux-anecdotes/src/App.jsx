import { useSelector, useDispatch } from 'react-redux'
import { voteAction } from './reducers/anecdoteReducer'
import AnecDoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecDoteForm />
    </div>
  )
}

export default App