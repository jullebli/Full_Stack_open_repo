import { useSelector } from 'react-redux'

const Notification = () => {
  //const state = useSelector((state) => state)
  //console.log('Notification state', state)
  //const notification = useSelector((state) => state.notification)

  //console.log('Notification notification', notification)

  const { content, color } = useSelector((state) => state.notification)
  //console.log('Notification content', content)
  //console.log('Notification color', color)

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
