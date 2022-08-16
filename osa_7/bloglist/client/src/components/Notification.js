import { useSelector } from 'react-redux'

const Notification = () => {
  const { content, color } = useSelector((state) => state.notification)

  if (!content) {
    return null
  }

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    borderStyle: 'solid',
    fontSize: '20px',
    borderRadius: '5px',
    padding: '10px',
  }

  return (
    <div style={notificationStyle} id='notification'>
      {content}
    </div>
  )
}

export default Notification
