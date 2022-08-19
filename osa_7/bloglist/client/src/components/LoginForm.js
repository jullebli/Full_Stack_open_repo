import PropTypes from 'prop-types'
import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label='username'
            variant='filled'
            value={username}
            onChange={handleUsernameChange}
            id='username'
          />
        </div>
        <div>
          <TextField
            label='password'
            variant='filled'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            id='password'
          />
        </div>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          id='loggingIn'
        >
          login
        </Button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
