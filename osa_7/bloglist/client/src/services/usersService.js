import axios from 'axios'
const baseUrl = '/api/users'

/*
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
} */

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

/*
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedUser) => {
  const response = await axios.put(`${baseUrl}/${updatedUser.id}`, updatedUser)
  return response.data
}

const deleteUser = async (toBeDeletedUser) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(
    `${baseUrl}/${toBeDeletedUser.id}`,
    config
  )
  return response.data
}
*/

const usersService = {
  getAll,
}

export default usersService
