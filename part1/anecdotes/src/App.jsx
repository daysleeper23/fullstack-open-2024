import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(8).fill(0))

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 8)
  }

  const handleNextAnecdoteClick = () => {
    let nextSelected = getRandomNumber()
    while (nextSelected == selected) {
      console.log('still the same number... regenerate')
      nextSelected = getRandomNumber()
    }
      
    console.log('next anecdote position', nextSelected, vote[nextSelected])
    setSelected(nextSelected)
  }

  const handleVote = () => {
    const newVote = [...vote]
    newVote[selected]++
    console.log('increase vote of', selected, 'to', newVote[selected])
    setVote(newVote)
  }

  return (
    <div>
      {anecdotes[selected]}
      <p>has {vote[selected]} votes</p>
      <div>
        <button onClick={handleVote}>
          vote
        </button>
        <button onClick={handleNextAnecdoteClick}>
          next anecdote
        </button>
      </div>
    </div>
  )
}

export default App