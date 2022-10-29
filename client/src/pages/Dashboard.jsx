import { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";

function Dashboard() {
  //for inputs
  const inputTaskRef = useRef()
  const editTaskRef = useRef()

  //for task management
  const [tasks, setTasks] = useState([])
  
  //for sidebar
  const [toggle, setToggle] = useState(true)
  const [grid, setGrid] = useState("") 
  const [selectedTask, setSelectedTask] = useState("")

  //task hook
  const Task = (props) => {
    return(
      <div onClick={() => {
        TodoItemDetails()
        setSelectedTask(props.id)
        editTaskRef.current.value = ""
      }} className="bg-white w-full hover:bg-gray-200 p-4 my-1 rounded shadow-sm text-left">{props.value}</div>
    )
  }
  
  //shows the sidebar
  const TodoItemDetails = () => {
    setToggle(false)
    setGrid("grid grid-cols-4")
  }

  //closes the sidebar
  const closeSideBar = () => {
    setToggle(true)
    setGrid("")
    editTaskRef.current.value = ""
  } 
  
  //for placeholder
  const placeholder = (selectedTaskId) => {
    if(selectedTaskId !== ""){
      try{ let task = tasks.find(task => task.id === selectedTaskId); return task.value} catch {}
    }
  }

  const createdDate = (selectedTaskId) => {
    if(selectedTaskId !== ""){
      try{ 
        let task = tasks.find(task => task.id === selectedTaskId)
        let date = new Date(task.date)
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return `Created on ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
      } catch {}
    }
  }

  //for refreshing the task list
  let isFirst = true
  useEffect(() => {
    if(isFirst){
      isFirst = false
      return
    } 
    getTasks()
  }, [tasks])

  //user token for axios requests
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
  };

  //for getting all tasks from user
  const getTasks = () => {
    axios.get('http://localhost:8000/api/tasks', config)
    .then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        if(!tasks.some(task => task.id === response.data[i]._id)){
          setTasks(array => [...array, {
            task: <Task id={response.data[i]._id} value={response.data[i].text} />,
            id: response.data[i]._id,
            value: response.data[i].text,
            date: response.data[i].createdAt
          }])
        }       
      }
    })
    .catch(function (error) {
      if(error.response.data.message){
        toast.error(error.response.data.message, toastStyling)
      }
    })
  }

  //for inserting a task
  const insertTask = e => {
    e.preventDefault()
    let value = inputTaskRef.current.value

    if(value !== ""){
      axios.post('http://localhost:8000/api/tasks', { text: value }, config)
      .then(function (response) {
        setTasks(array => [...array, {
          task: <Task id={response.data._id} value={response.data.text} />,
          id: response.data._id,
          value: response.data.text,
          date: response.data.createdAt
        }])
        toast.success('Task Added!', toastStyling)
      })
      .catch(function (error) {
        if(error.response.data.message){
          toast.error(error.response.data.message, toastStyling);
        }
      })
      inputTaskRef.current.value = ""
    }
  }

  //for editing a task
  const editTask = e => {
    if(e){
      e.preventDefault()
    }
    
    let value = editTaskRef.current.value

    if(value !== ""){
      axios.put('http://localhost:8000/api/tasks/' + selectedTask.toString(), { text: value },  config)
      .then(function (response) {
        let editedTaskIndex = tasks.findIndex(task => task.id === response.data._id)
        tasks[editedTaskIndex].task = <Task id={response.data._id} value={response.data.text} />
        tasks[editedTaskIndex].value = response.data.text
        editTaskRef.current.value = ''
        setTasks((task) => [...task])
        toast.success('Task Edited!', toastStyling)
      })
      .catch(function (error) {
        if(error.response.data.message){
          toast.error(error.response.data.message, toastStyling)
        }
      })
    }
  }

  //for deleting a task
  const deleteTask = () => {
    axios.delete('http://localhost:8000/api/tasks/' + selectedTask.toString(), config)
    .then(function () {
      let deletedTaskIndex = tasks.findIndex(task => task.id === selectedTask)
      tasks.splice(deletedTaskIndex, 1)
      editTaskRef.current.value = ''
      closeSideBar()
      toast.error('Task Deleted!', toastStyling)
    })
    .catch(function (error) {
      if(error.response.data.message){
        toast.error(error.response.data.message, toastStyling)
      }
    })
  }

  //toast styling
  const toastStyling = {
    position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  }

  return (
    <>
      <div className="bg-gray-100 items-center justify-center min-h-[94vh] min-w-screen p-4">
        <div className={grid}>
          <div className="col-span-2 xl:col-span-3">  
            <form onSubmit={insertTask} className="bg-white rounded py-4 px-2 my-4 h-16 shadow-sm">
              <button type="submit" className="text-cyan-800 float-right text-2xl -translate-y-0.5 -translate-x-1">+</button>
              <input className="w-[85%] sm:w-[87%] md:w-[90%] lg:w-[95%] h-full float-left focus:outline-none placeholder-cyan-800 ml-2 py-1 focus:placeholder-black" type="text" id="task" placeholder="Add a task" ref={inputTaskRef} onFocus={() => closeSideBar()}/>
            </form>
            <ul>
              {tasks.map(value => { return <li key={value.id}>{value.task}</li> })}
            </ul>
          </div>
          <div hidden={toggle} className={"col-span-2 xl:col-span-1 bg-white rounded py-2.5 px-2 ml-5 my-4 h-[122px] shadow-sm"}>
            <form className="border-2 border-cyan-800 rounded h-16 pt-[6px] shadow-sm" onSubmit={editTask}>
              <input className="w-[85%] sm:w-[87%] md:w-[90%] lg:w-[95%] h-12 mx-2 float-left focus:outline-none placeholder-cyan-800 focus:placeholder-black" type="text" id="edit" placeholder={placeholder(selectedTask)} ref={editTaskRef} onBlur={() => editTask()} />
            </form>
            <div className='grid grid-cols-6'>
              <button className="col-span-1 text-black h-10 text-3xl mt-1 float-left" onClick={() => closeSideBar()}><TbLayoutSidebarRightCollapse /></button>
              <p className="col-span-4 text-center mt-1 text-black text-sm sm:mt-4">{createdDate(selectedTask)}</p>
              <button className="col-span-1 text-black absolute right-6 top-[177px] text-2xl float-right" onClick={() => deleteTask()}><FaTrash /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard