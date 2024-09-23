import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { useField } from "../hooks/useField"
import Button from "./Button"
import InputLabeled from "./InputLabeled"
import { LOGIN } from "../queries/mutations"
import { useState, useEffect } from "react"
import { USER_CURRENT } from "../queries/queries"

const Login = () => {
  const client = useApolloClient()
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')
  const [ token, setToken ] = useState(null)

  const { userLoading, userError, userData } = useQuery(USER_CURRENT)
  const [ userLogin, result ] = useMutation(LOGIN, {
    refetchQueries: [ 
      { query: USER_CURRENT },
    ],
    onError: (error) => {
      const messages = error.graphQLError.map(e => e.message).join('\n')
      console.log('error:', messages)
    }
  })

  // const [ getCurrentUser ] = useQuery

  const handleSubmit = async (event) => {
    event.preventDefault()
    // console.log('login with username', username.value, 'and password', password.value)
    try {
      const value = await userLogin({ variables: {
        username: username.value,
        password: password.value
      }})
      console.log('logged in', value)
      
    } catch (error) {

    }
  }

  const handleLogout = async () => {
    console.log('logout')
    setToken('')
    localStorage.removeItem("loggedLibraryAppToken")
    client.resetStore()
  }

  useEffect(() => {
    async function fetchAuth() {
      const token = localStorage.getItem("loggedLibraryAppToken");
      if (token) {
        setToken(token)
        await client.refetchQueries({
          include: [ USER_CURRENT ],
        });
      }
    }
    fetchAuth()
  }, []);

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem("loggedLibraryAppToken", token);
    }
  }, [result.data])

  if (token === '' || !token) {
    // console.log('token', token)
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputLabeled required label="Username" field={username}/>
          <InputLabeled required label="Password" field={password}/>
          <Button type="submit" variant="solid">Login</Button>
        </form>
      </div>
    )
  } else {
    // console.log('token', token)
    return (
      <div className="space-y-6">
        <div>
          {userLoading} {userError} {userData} Logged in
        </div>
        <Button onClick={handleLogout} variant="solid">Logout</Button>
      </div>
    )
  }
}
export default Login