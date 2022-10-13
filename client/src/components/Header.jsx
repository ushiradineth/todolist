import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='flex justify-between items-center px-[20px] py-2 border-b-[1px] border-b-[#e6e6e6] border-solid'>
      <div className=''>
        <Link to='/'>
          <h1 className="leading-normal font-extrabold text-white-700">
            todolist
          </h1>
        </Link>
      </div>
      <ul className='flex items-center justify-between ml-[20px]'>
        {user ? (
          <li className='ml-[20px]'>
            <button onClick={onLogout}>
              <div className='pl-5'><FaSignOutAlt /></div>
              <h1 className="leading-normal font-bold text-white-700">
                Logout
              </h1>
            </button>
          </li>
        ) : (<>
          <li className='ml-[20px]'>
            <Link to='/login'>
              <div className='pl-2'><FaSignInAlt /></div>
              <h1 className="leading-normal font-bold text-white-700">
                Login
              </h1>
            </Link>
          </li>
          <li className='ml-[20px]'>
            <Link to='/register'>
              <div className='pl-5'><FaUser /></div> 
              <h1 className="leading-normal font-bold text-white-700">
                Register
              </h1>
            </Link>
          </li>
        </>)}
      </ul>
    </header>
  )
}

export default Header