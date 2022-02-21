import React from 'react'

const Notification = ({ message }) => {
  const notificationStyle = {
      color: 'green',
      background: 'lightgrey',
      borderStyle: 'solid',
      fontSize: '20px',
      borderRadius: '5px',
      padding: '10px'


  }
  if (message === null) {
     return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
