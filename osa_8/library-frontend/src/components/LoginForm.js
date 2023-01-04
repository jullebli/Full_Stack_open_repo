import { useEffect, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN, ME } from "./queries";

const LoginForm = (props) => {
  const client = useApolloClient()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem("user-token", token)
      //console.log("useEffect loginForm")
      //console.log("localStorage.getItem(user-token)", localStorage.getItem("user-token"))
      client.refetchQueries({ include: ME }).then((data) => {
        //console.log("ME query refetched")
        //console.log(data)
    })
  }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password }})
    //props.setPage("authors")
    setUsername("")
    setPassword("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm