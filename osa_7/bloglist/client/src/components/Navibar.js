//import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppBar, Toolbar, Button } from '@mui/material'
//import { blue } from '@mui/material/colors'

const textStyle = {
  margin: 10,
}

const NaviBar = ({ handleLogOut }) => {
  const user = useSelector((state) => state.user)
  return (
    <AppBar position='static'>
      <Toolbar>
        {user ? (
          <Button color='inherit' component={Link} to='/'>
            blogs
          </Button>
        ) : null}
        <Button color='inherit' component={Link} to='/users'>
          users
        </Button>
        {user ? (
          <div style={textStyle}>
            <span style={{ marginRight: 5 }}>{user.name} LOGGED IN </span>
            <Button
              variant='contained'
              type='submit'
              onClick={() => handleLogOut()}
              id='logOut'
            >
              logout
            </Button>
          </div>
        ) : (
          <Button color='inherit' component={Link} to='/'>
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NaviBar
