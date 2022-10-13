import { FaSignInAlt, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {
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
      </ul>
    </header>
  )
}

export default Header