const express = require('express')
var jwt = require('jsonwebtoken');
// const { Client } = require('socket.io/dist/client.js');
// const { route } = require('../../Express Web应用框架技术/ExpressTeach/UserRouter')
const router = express.Router()
const userDao = require('./UserDao.js')

function Umsg(code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
}

router.get('/getUser', async function (req, res) {
    var email = req.query.email;
    var username = req.query.username;
    var user = await userDao.getUser(email)
    res.send(new Umsg(0, 'get success', user))
})


router.post('/addUser', (req, res) => {
    userDao.addUser();
    res.send(new Umsg(0, 'post success', null))
})

router.post('/updateUser', (req, res) => {
    userDao.updateUser();
    res.send(new Umsg(0, 'post success', null))
})
// 用户修改信息的接口
router.post('/changeInfo',verify,userDao.changeInfo)
//用户修改密码的接口
router.post('/changePwd', verify, userDao.changePwd)

router.post('/deleteUser', (req, res) => {
    userDao.deleteUser();
    res.send(new Umsg(0, 'delete success', null))
})
// 登陆接口
router.post('/login', userDao.getUser)
//查询登陆用户信息的接口
router.post('/getLoginUser', verify, userDao.getLoginUser)

// 注册接口
router.post('/register', userDao.addUser)

function verify(req, res, next) {
    var token = req.get('Authorization').split(' ')[1]
    jwt.verify(token, 'shhhhh', function (err, user) {
        if (err) {
            res.status(403).send(new Umsg(1, 'auth failed', null))
        }
        else {
            req.body.username = user.username
            next()
        }
        // bar
    });
}
module.exports = router