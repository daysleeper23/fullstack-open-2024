import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAll, update } from './requests'
import { useNotiDispatch } from './NotificationContext'

const App = () => {
  const dispatch = useNotiDispatch()
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false
  })
  console.log('result query', result.data)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: update,
    onSuccess: (data) => {
      // console.log('data:', data)
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'VOTE',
        payload: data.content
      })

      setTimeout(() => {
        console.log('timeout')
        dispatch({
          type: 'REMOVE',
          payload: ''
        })
      }, 5000)
    }
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (!result.data)
    return <div>anecdote service not available due to problems in server</div>

  const anecdotes = result.data

  

  const handleVote = (anecdote) => {
    // console.log('vote')
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