import {createContext, useReducer} from "react"

const userContext = createContext()
const initialState = {
  user: [],
}
const counterReducer = (state, action) => {
  switch (action.type) {
    case "Fetch_UserData":
      return {...state, user: action.payload}
    default:
      return state
  }
}
const CounterProvider = ({children}) => {
  const [state, dispatch] = useReducer(counterReducer, initialState)
  return (
    <userContext.Provider value={{state, dispatch}}>
      {children}
    </userContext.Provider>
  )
}
export {userContext, CounterProvider}
