const express = require('express')
const path = require('path')
const cors = require('cors')

require('./dbConnect')

const app = express()

app.use(express.json())

app.use(cors())

const userRouter = require('./routes/usersRoute')
app.use('/api/users/', userRouter)

const transactionsRouter = require('./routes/transactionsRoute')
app.use('/api/transactions/', transactionsRouter)

const port = process.env.PORT || 5000
app.listen(port, () => 
    console.log(`Server started at port ${port}`
))
