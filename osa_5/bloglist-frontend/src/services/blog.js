import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updatedBlog => {
  //console.log('blogService update updatedBlog', updatedBlog)
  //console.log('blogService ${baseUrl}/${updatedBlog.id}', `${baseUrl}/${updatedBlog.id}`)
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  //console.log('blogService response', response)
  return response.data
}

const blogService = {
  getAll,
  setToken,
  create,
  update
}

export default blogService