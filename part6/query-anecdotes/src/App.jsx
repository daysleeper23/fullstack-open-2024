import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAll, update } from './requests'

const App = () => {
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll
  })
  console.log('result query', result.data)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({ 
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (!result.data)
    return <div>anecdote service not available due to problems in server</div>

  const anecdotes = result.data

  

  const handleVote = (anecdote) => {
    console.log('vote')
    updateMutation.mutate(anecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App