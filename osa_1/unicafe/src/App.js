import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const Statistic = ({category, value}) => (
  <p>{category} {value}</p>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <h1>Unicafe</h1>
        <h2>Give feedback:</h2>
        <Button handleClick={() => setGood(good + 1)} text='good' />
        <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
        <Button handleClick={() => setBad(bad + 1)} text='bad' />
        <h3>Statistics:</h3>
        <Statistic category='good' value={good}></Statistic>
        <Statistic category='neutral' value={neutral}></Statistic>
        <Statistic category='bad' value={bad}></Statistic>
      </div>
    </div>
  )
}

export default App
