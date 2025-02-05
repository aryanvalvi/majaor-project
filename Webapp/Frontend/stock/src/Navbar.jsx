import {useContext, useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {useLocation} from "react-router-dom"
import "./Navbar.scss"
import {userContext} from "./context/Usercontext"
const Navbar = () => {
  const location = useLocation()
  const {state, dispatch} = useContext(userContext)
  const user = state.user.user
  console.log(user)
  const [isHovered, setIsHovered] = useState(false)
  // const dispatch = useAppDispatch();
  // const {user} = useAppSelector(
  //   (state) => state.UserDataFetchReducer.userData
  // );
  // console.log(user)
  const showBackgroundImage =
    location.pathname === "/" || location.pathname === "/home"
  const HandleLogin = () => {
    window.location.href = "http://localhost:5002/auth/google"
  }
  const handleLogout = async () => {
    const res = await fetch("http://localhost:5002/auth/logout", {
      method: "GET",
      credentials: "include",
    })
    const data = await res.json()
    console.log("Logout", data)
  }

  const isUserFetch = async () => {
    const res = await fetch("http://localhost:5002/check", {
      method: "GET",
      credentials: "include",
    })
    const data = await res.json()
    dispatch({type: "Fetch_UserData", payload: data})
    console.log(data)
  }
  useEffect(() => {
    isUserFetch()
  }, [])
  return (
    <div className={` ${showBackgroundImage ? `wback` : `NavbarContaine`}`}>
      {/* <Link href="/">
        <div className="logo"></div>
      </Link> */}
      <div className="NavbarContainer RightPart">
        <nav>
          <ul
            className={`${
              showBackgroundImage ? "navbarElements" : "navbarElementsL"
            }`}
          >
            <Link to="/">
              <li className="logo">
                <h1>Major_Project.</h1>
              </li>
            </Link>
            <Link to="/" className="Link">
              <li className="home">home</li>
            </Link>
            <Link to="/live" className="Link">
              <li className="home">stock study</li>
            </Link>

            <Link to="/portfolio" className="Link Explore">
              <li>Portfolio management</li>
            </Link>
            <Link to="/prediction" className="Link ">
              <li>Stock Prediction</li>
            </Link>
          </ul>
        </nav>

        <nav>
          <ul className="navbarElements">
            {/* <li className="Learn">Learn</li> */}
            {!user || !user._id ? (
              <li>
                <button onClick={HandleLogin} className="btn sign">
                  log in
                </button>
              </li>
            ) : (
              <>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="profile"
                >
                  <Link href={`/user/profile/${user._id}`}>
                    {user && (
                      <img
                        className="profile-picture"
                        src={`${user.userImage}`}
                      />
                    )}
                  </Link>
                  <p
                    className={` ${
                      showBackgroundImage ? "profile-name" : "profile-nameL"
                    }`}
                  >
                    {user.username}
                  </p>
                  {isHovered && (
                    <button onClick={handleLogout} className="logout">
                      LogOut
                    </button>
                  )}
                </div>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
