import { useState } from 'react'

const Header = ({title}) => {
  return (
    <h1>{title}</h1>
  )
}

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>
        {text}  
      </td>
      <td>
        {value}
      </td>
    </tr>
    
  )
}

const Statistics = ({good, neutral, bad}) => {

  if (good > 0 || neutral > 0 || bad > 0) {
    return (  
      <>
        <Header title='statistics' />
        <table>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='all' value={good + neutral + bad} />
          <StatisticsLine text='average' value={(good * 1 + neutral * 0 + bad * (-1)) / (good + neutral + bad)} />
          <StatisticsLine text='positive' value={good / (good + neutral + bad) * 100} />
        </table>
      </>
    )
  }

  return (  
    <>
      <Header title='statistics' />
      <p>No feedback given</p>
    </>
  )
}

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => { 
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header title='give feedback' />
      <Button text='good' handleClick={() => setGood(good + 1)} />
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' handleClick={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App