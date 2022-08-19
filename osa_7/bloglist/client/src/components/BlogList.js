import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import { blue } from '@mui/material/colors'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)

  return (
    <div>
      <TableContainer component={Paper} id='blogListing'>
        <Table>
          <TableBody>
            {[...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <TableRow
                  key={blog.id}
                  sx={{
                    backgroundColor: blue[100],
                    border: `3px solid ${blue[500]}`,
                  }}
                  className='blog'
                >
                  <TableCell>
                    <Link
                      to={`/blogs/${blog.id}`}
                      className='blogLink'
                      id='blogLink'
                    >
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className='coloredText'>{blog.author}</div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
