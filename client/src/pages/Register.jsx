import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  if(localStorage.getItem('token')){
    navigate('/')
    return (<></>)
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(password !== password2){
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password
      }

      axios.post('http://localhost:8000/api/users', userData)
      .then(function (response) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        localStorage.setItem('userid', JSON.stringify(response.data._id));
        navigate('/')
      })
      .catch(function (error) {
        if(error.response.data.message){
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
    }
  } 

  return <>
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-[94vh]">
      <section>
        <h1 className='text-5xl md:text-[5rem] leading-normal font-extrabold text-white-700'>
          <div className='pl-[120px]'><FaUser /></div> Register
        </h1>
      </section>

      <section className='bg-white shadow-md rounded px-6 pb-6 pt-2 mt-6 mb-4 w-80'>
        <form onSubmit={onSubmit} className="grid gap-3 pt-3 mt-3 text-center md:w-auto lg:w-auto">
          <input type="text" name="name" id="name" value={name} placeholder='Name' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" onChange={onChange} />
          <input type="email" name="email" id="email" value={email} placeholder='Email' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" onChange={onChange} />
          <input type="password" name="password" id="password" value={password} placeholder='Password' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" onChange={onChange} />
          <input type="password" name="password2" id="password2" value={password2} placeholder='Confirm password' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" onChange={onChange} />
          <button type="submit" className="bg-blue-500 text-white font-bold w-full py-3 px-3 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </section>
    </div>
  </>
}

export default Register