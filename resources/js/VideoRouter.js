const express = require('express')
// var jwt = require('jsonwebtoken');
// const { Client } = require('socket.io/dist/client.js');
// const { route } = require('../../Express Web应用框架技术/ExpressTeach/UserRouter')
const router = express.Router()
const videoDao = require('./VideoDao.js')

function Umsg(code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
}
//查询一个视频信息
router.get('/getVideo', videoDao.getVideo)
//查询所有视频信息
router.get('/getVideos', videoDao.getVideos)
//搜索视频接口
router.post('/getOneVideo', videoDao.getOneVideo)
//添加视频接口
router.post('/addVideo', videoDao.addVideo)
//按分类查询并按播放量排列视频
router.post('/getType', videoDao.getType)
//推荐受欢迎的视频
router.get('/view', videoDao.view)
//更新视频的内容
router.post('/updateVideo', videoDao.updateVideo)


// router.post('/changePwd', verify, function (req, res) {
//     console.log(req.get('Authorization'))
//     res.send(new Umsg(0, 'changePwd success', req.body))
// })

module.exports = router