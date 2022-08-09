import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(anecdote => anecdote.content.includes(filter))
  })

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(createNotification(`You voted '${anecdote.content}'`))
  }

  return (
    <div>
      {[...anecdotes].sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes} <button
                onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList