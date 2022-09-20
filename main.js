const express = require('express')

const userRouter = require('./resources/js/UserRouter.js')
const videoRouter = require('./resources/js/VideoRouter.js')
const app = express()

const port = 80

app.use(express.static('./resources/pages', { extensions: 'html' }))
app.use(express.static('./resources'))
app.use(express.json(), express.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', '*')
    next();
})
app.use(userRouter)
app.use(videoRouter)

app.get('/hello', (req, res) => {
    console.log('hello world')
    res.send('hello world')
})

app.use((err, req, res, next) => {
    console.log('err:' + err.message)
    res.status(500).send(err.message)
})


app.listen(port, (err) => {
    console.log(`server is listening on port ${port}`)
})
