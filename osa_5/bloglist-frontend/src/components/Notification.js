const Notification = ({ message, error }) => {

  const notificationStyle = {
    color: error ? 'red' : 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    fontSize: '20px',
    borderRadius: '5px',
    padding: '10px'
  }

  console.log('Notification, message, error', message, error)
  if (message === null) {
    return null
  }
  if (error) {
    return (
      <div className='error' style={notificationStyle}>
        {message}
      </div>
    )
  } else {
    return (
      <div className='success' style={notificationStyle}>
        {message}
      </div>
    )
  }
}

export default Notification