import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { content, color } = useSelector((state) => state.notification)

  if (!content) {
    return null
  }

  if (color === 'green') {
    return (
      <Alert severity='success' id='notification'>
        {content}
      </Alert>
    )
  } else if (color === 'red') {
    return (
      <Alert severity='error' id='notification'>
        {content}
      </Alert>
    )
  }
}

export default Notification
