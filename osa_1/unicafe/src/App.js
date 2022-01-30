import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const Count = ({category, value}) => (
  <p>{category} {value}</p>
)

const Average = ({average, total}) => {
  if (total===0) {
    return <p>average 0</p>
  }
  return <p>average {average}</p>
}

const Positive = ({positive}) => {
  if (isNaN(positive)) {
    return <p>positive 0 %</p>
  }
  return <p>positive {positive} %</p>
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = (good * 1 + neutral * 0 + bad * -1)/all
  const positive = good / all * 100

  return (
    <div>
      <div>
        <h1>Unicafe</h1>
        <h2>Give feedback:</h2>
        <Button handleClick={() => setGood(good + 1)} text='good' />
        <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
        <Button handleClick={() => setBad(bad + 1)} text='bad' />
        <h3>Statistics:</h3>
        <Count category='good' value={good} />
        <Count category='neutral' value={neutral} />
        <Count category='bad' value={bad} />
        <p>all {all}</p>
        <Average average={average} total={all}/>
        <Positive positive={positive}/>
      </div>
    </div>
  )
}

export default App
