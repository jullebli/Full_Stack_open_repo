import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { createNotification, clearToInitial } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  //const notification = useSelector(state => state.notification)
  let clearNotificationIsSet = null
  //in order to stop notification resetting timer when new notification is added

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    //console.log('addAnecdote content', content)
    dispatch(createAnecdote(content))
    if (clearNotificationIsSet) {
      clearTimeout(clearNotificationIsSet)
    }
    dispatch(createNotification(`you added anecdote '${content}'`))
    //console.log('addAnecdote notification', notification)
    clearNotificationIsSet = setTimeout(() => {
      dispatch(clearToInitial())
    }, 5000)
    
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
