import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from '../requests'
import { useNotiDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const notiDispatch = useNotiDispatch()
  const queryClient = useQueryClient()

  const createMutation = useMutation({ 
    mutationFn: create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notiDispatch({
        type: 'CREATE',
        payload: data.content
      })

      setTimeout(() => {
        notiDispatch({
          type: 'REMOVE',
          payload: ''
        })
      }, 5000)
    },
    onError: (error) => {
      console.log('error creating:', error.message)
      notiDispatch({
        type: 'SHORT',
        payload: ''
      })
    
      setTimeout(() => {
        console.log('timeout error')
        notiDispatch({
          type: 'REMOVE',
          payload: ''
        })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')

    createMutation.mutate(content)    
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
