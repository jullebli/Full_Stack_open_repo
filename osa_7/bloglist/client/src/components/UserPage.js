import { useParams } from 'react-router-dom'

const UserPage = ({ users }) => {
  if (!users) {
    return null
  }
  const id = useParams().id
  const pageUser = users.find((user) => user.id === id)

  const UserInformation = () => {
    return (
      <div>
        <h2>{pageUser.name}</h2>
        <p style={{ fontWeight: 'bold' }}>added blogs</p>
        <ul>
          {pageUser.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    )
  }

  return <div>{pageUser === null ? null : <UserInformation />}</div>
}

export default UserPage
