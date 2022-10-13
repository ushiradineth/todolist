import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
  }

  let inputCSS = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"

  return <>
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-[94vh]">
      <section>
        <h1 className='text-5xl md:text-[5rem] leading-normal font-extrabold text-white-700'>
          <div className='pl-[60px]'><FaSignInAlt /></div> Login
        </h1>
      </section>

      <section className='bg-white shadow-md rounded px-6 pb-6 pt-2 mt-6 mb-4 w-80'>
        <form onSubmit={onSubmit} className="grid gap-3 pt-3 mt-3 text-center md:w-auto lg:w-auto">
          <input type="email" name="email" id="email" value={email} placeholder='Email' className={inputCSS} onChange={onChange} />
          <input type="password" name="password" id="password" value={password} placeholder='Password' className={inputCSS} onChange={onChange} />
          <button type="submit" className="bg-blue-500 text-white font-bold w-full py-3 px-3 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </section>
    </div>
  </>
}

export default Login