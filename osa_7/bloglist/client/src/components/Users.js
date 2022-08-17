import { useSelector } from 'react-redux'
import Notification from './Notification'
import usersService from '../services/usersService'
import { Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const Users = ({ handleLogOut }) => {
  const user = useSelector((state) => state.user)
  const [users, setUsers] = useState(null)

  useEffect(() => {
    usersService.getAll().then((users) => {
      setUsers(users)
    })
  }, [])

  const UsersTable = () => {
    console.log('Users users', users)
    return (
      <div>
        <Table bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      {user === null ? null : (
        <p>
          {user.name} logged in{' '}
          <button type='submit' onClick={() => handleLogOut()} id='logOut'>
            logout
          </button>
        </p>
      )}
      <div>
        <h2>Users</h2>
        {users === null ? null : <UsersTable />}
      </div>
    </div>
  )
}

export default Users
