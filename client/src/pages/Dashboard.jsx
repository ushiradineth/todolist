import { useState, useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import e from 'cors';

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

  //init task array from api
  const tasksRefresh = () => {
    const config = {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
    };

    axios.get('http://localhost:8000/api/tasks',
      config
    ).then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        if(!tasks.some(task => task.id === response.data[i]._id)){
          setTasks(array => [...array, {
            task: <Task id={response.data[i]._id} value={response.data[i].text} />,
            id: response.data[i]._id,
            value: response.data[i].text,
          }])
        }       
      }
    })
    .catch(function (error) {
      console.log(error);
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
        })
      }
    })
  }


  tasksRefresh()

  //task hook
  const Task = (props) => {
    return(
        <li key={props.id} onClick={() => {
          TodoItemDetails()
          setSelectedTask(props.id)
          editTaskRef.current.value = ""
        }} className="bg-white w-full hover:bg-gray-200 p-4 my-1 rounded shadow-sm text-left">{props.value}</li>
    )
  }

  //shows the sidebar
  const TodoItemDetails = () => {
    setToggle(false)
    setGrid("grid grid-cols-2")
  }

  //form handling
  const onFormSubmit = e => {
    e.preventDefault()
    let value = inputTaskRef.current.value

    if(value !== ""){
      const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
      };
      
      const bodyParameters = {
        text: value, 
        user: JSON.parse(localStorage.getItem('userid'))
      };
      axios.post('http://localhost:8000/api/tasks',
        bodyParameters,
        config
      ).then(function () {
        tasksRefresh()
        toast.success('Task Added!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
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
      inputTaskRef.current.value = ""
    }
  }

  //closes the sidebar
  const closeSideBar = () => {
    setToggle(true)
    setGrid("")
    editTaskRef.current.value = ""
  }  

  //for editing a task
  const editTask = () => {
    let value = editTaskRef.current.value
    if(value !== ""){
      let editedTaskIndex = tasks.findIndex(task => task.id === parseInt(selectedTask))
      tasks[editedTaskIndex].task = <Task value={value} key={selectedTask} id={selectedTask} />
      tasks[editedTaskIndex].value = value
      editTaskRef.current.value = ''
      setTasks((task) => [...task])
    }
  }
  
  //for deleting a task
  const deleteTask = () => {
    let deletedTaskIndex = tasks.findIndex(task => task.id === parseInt(selectedTask))
    tasks.splice(deletedTaskIndex, 1)
    editTaskRef.current.value = ''
    closeSideBar()
  }

  //for placeholder
  const placeholder = (sTask) => {
    if(sTask !== ""){
      try{ let t = tasks.find(task => task.id === sTask); return t.value} catch {}
    }
  }

  return (
    <>
      <div className="bg-gray-100 items-center justify-center min-h-[94vh] min-w-screen p-4">
        <div className={grid}>
          <div>  
            <form onSubmit={onFormSubmit} className="bg-white rounded py-4 px-2 my-4 h-16 shadow-sm">
              <button type="submit" className="text-blue-500 float-right text-2xl -translate-y-0.5 -translate-x-1">+</button>
              <input className="w-[85%] sm:w-[87%] md:w-[90%] lg:w-[95%] h-full float-left focus:outline-none placeholder-blue-500 ml-2 py-1 focus:placeholder-black" type="text" id="task" placeholder="Add a task" ref={inputTaskRef} onFocus={() => closeSideBar()}/>
            </form>
            <ul>
              {tasks.map(value => { return <div>{value.task}</div> })}
            </ul>
          </div>
          <div hidden={toggle} className={"bg-white rounded py-2.5 px-2 ml-5 my-4 h-72 shadow-sm "+grid}>
            <input className="col-start-1 col-end-3 w-100 h-12 float-left focus:outline-none placeholder-blue-500 focus:placeholder-black ml-2 " type="text" id="edit" placeholder={placeholder(selectedTask)}  ref={editTaskRef} onBlur={() => editTask()}/>
            <button className="col-start-1 col-end-2 text-blue-500 h-12 mt-44 text-2xl mr-14" onClick={() => deleteTask()}>delete</button>
            <button className="col-start-2 col-end-3 text-blue-500 h-12 mt-44 text-2xl ml-14" onClick={() => closeSideBar()}>x</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard