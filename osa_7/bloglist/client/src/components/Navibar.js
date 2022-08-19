import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const linkStyle = {
  margin: 0.5,
}

const Navibar = ({ handleLogOut }) => {
  const user = useSelector((state) => state.user)
  return (
    <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          {user ? (
            <Nav.Link href='#' as='span'>
              <Link style={linkStyle} to='/'>
                blogs
              </Link>
            </Nav.Link>
          ) : null}
          <Nav.Link href='#' as='span'>
            <Link style={linkStyle} to='/users'>
              users
            </Link>
          </Nav.Link>
          <Nav.Link href='#' as='span'>
            {user ? (
              <p>
                {user.name} logged in{' '}
                <button
                  type='submit'
                  onClick={() => handleLogOut()}
                  id='logOut'
                >
                  logout
                </button>
              </p>
            ) : (
              <Link to='/'>login</Link>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navibar
