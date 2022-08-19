import { useParams } from 'react-router-dom'
import '../index.css'
//import { blue } from '@mui/material/colors'

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
        <div className='coloredText'>
          <div style={{ fontWeight: 'bold' }}>added blogs</div>
          <ul>
            {pageUser.blogs.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return <div>{pageUser === null ? null : <UserInformation />}</div>
}

export default UserPage
