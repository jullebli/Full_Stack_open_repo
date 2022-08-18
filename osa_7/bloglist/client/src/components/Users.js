import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  const UsersTable = () => {
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
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
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
      <h2>Users</h2>
      {users === null ? null : <UsersTable />}
    </div>
  )
}

export default Users
//antother way counting blogs: {user.blogs.reduce((blogs) => blogs + 1, 0)}
