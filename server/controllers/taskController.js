const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel')
const User = require('../models/userModel')

// @desc Get task
// @route GET /api/tasks
// @access Private
const getTask =  asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user })
    res.status(200).json(tasks)
})

// @desc Set task
// @route POST /api/tasks
// @access Private
const setTask = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }

    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }
    
    try {
        const task = await Task.create({
            text: req.body.text,
            user: req.user
        })
        
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
    }
})

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if(!task){
        res.status(401)
        throw new Error('Task not found')
    }

    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    //checking the logged in user matches the task user
    if(task.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedTask)
})

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if(!task){
        res.status(400)
        throw new Error('Task not found')
    }

    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    //checking the logged in user matches the task user
    if(task.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await task.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = { 
    getTask,
    setTask,
    updateTask,
    deleteTask
}