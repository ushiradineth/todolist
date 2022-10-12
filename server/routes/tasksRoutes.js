const express = require('express')
const router = express.Router()
const { getTask, setTask, updateTask, deleteTask } = require('../controllers/taskController')

module.exports = router

router.route('/').get(getTask).post(setTask)
router.route('/:id').put(updateTask).delete(deleteTask)