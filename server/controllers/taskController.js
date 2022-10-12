const asyncHandler = require('express-async-handler');

const Task = require('../models/taskModel')

// @desc Get task
// @route GET /api/task
// @access Private
const getTask =  asyncHandler(async (req, res) => {
    const tasks = await Task.find()
    res.status(200).json(tasks)
})

// @desc Set gotaskal
// @route POST /api/task
// @access Private
const setTask = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }

    const task = await Task.create({
        text: req.body.text
    })

    res.status(200).json(task)
})

// @desc Update task
// @route PUT /api/task/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if(!task){
        res.status(400)
        throw new Error('Task not found')
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedTask)
})

// @desc Delete task
// @route DELETE /api/task/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)

    if(!task){
        res.status(400)
        throw new Error('Task not found')
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