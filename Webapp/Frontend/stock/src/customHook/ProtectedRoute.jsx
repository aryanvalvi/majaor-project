import {useContext} from "react"
import {Navigate} from "react-router-dom"
import {userContext} from "../context/Usercontext"

const ProtectedRoute = ({children}) => {
  const {state} = useContext(userContext)
  const user = state.user?.user
  console.log(user)

  return user && user._id ? children : <Navigate to="/" replace />
}

export default ProtectedRoute
