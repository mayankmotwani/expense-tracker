const express = require('express')
const path = require('path')

require('./dbConnect')

const app = express()

app.use(express.json())

const userRouter = require('./routes/usersRoute')
app.use('/api/users/', userRouter)

const transactionsRouter = require('./routes/transactionsRoute')
app.use('/api/transactions/', transactionsRouter)

app.use('/', express.static('client/build'))

app.get('*' , (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => 
    console.log(`Server started at port ${port}`
))
