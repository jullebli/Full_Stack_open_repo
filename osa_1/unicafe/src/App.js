import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value}) => (
  <tr><td>{text}</td><td>{value}</td></tr>
)

const Positive = ({positive}) => {
  if (isNaN(positive)) {
    return <tr><td>positive</td><td>0 %</td></tr>
  }
  return <tr><td>positive</td><td>{positive} %</td></tr>
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad

  if (all===0) {
    return <p>No feedback given</p>
  }

  const average = (good * 1 + neutral * 0 + bad * -1)/all
  const positive = good / all * 100

  return (
  <table>
    <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text='bad' value={bad} />
      <StatisticLine text='all' value={all} />
      <StatisticLine text='average' value={average} />
      <StatisticLine text='positive' value={positive + " %"} />
    </tbody>
  </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>Unicafe</h1>
      <h2>Give feedback:</h2>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h3>Statistics:</h3>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App
// or <StatisticLine text='positive' value={`${positive} %`} />