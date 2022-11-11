const express = require('express')
const { message } = require('statuses')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
const cors = require('cors')

const app = express()

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/tasks', require('./routes/tasksRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.get('/', (req, res) => {
    return res.json({message: "this is working"});
});

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})