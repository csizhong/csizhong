const { MongoClient } = require("mongodb");
var jwt = require('jsonwebtoken');

const uri = require('../tools/ConfigPraser.js')
// Replace the uri string with your connection string.

const client = new MongoClient(uri);
const collection = 'video'

var videoDao = new Object()
// 构造用户对象函数
function Video(id, videoname, videotype, videoimg, videolink, videoepisodes) {
    this.id = id
    this.videoname = videoname
    this.videotype = videotype
    this.videoimg = videoimg
    this.videolink = videolink
    this.videoepisodes = videoepisodes
}

function Umsg(code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
}

//查询一个视频信息
async function getVideo(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        // var videoname = req.body.videoname
        const query = { videoname: "哆啦A梦" };
        var video = await videos.findOne(query)
        if (video != null) {
            video = { ...video, _id: '' };
            res.send(new Umsg(0, 'get success', video));
            console.log(video);
        }
        else {
            res.send(new Umsg(1, 'get faild', null))
        }
    }
    finally {
        // await client.close();
    }

}

//查询所有视频信息
async function getVideos(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        // var videoname = req.body.videoname
        const query = videos.find({}).sort({ videoview: -1 });
        var video = await query.toArray()
        // console.log(video[0]._id);
        if (video != null) {
            for (var i = 0; i < video.length; i++) {
                video[i] = { ...video[i], _id: '' };
            }
            res.send(new Umsg(0, 'get success', video));
        }
        else {
            res.send(new Umsg(1, 'get faild', null))
        }
    }
    finally {
        // await client.close();
    }

}

//搜索视频
async function getOneVideo(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        var videoname = req.body.videoname
        var reg = new RegExp(videoname)
        var video = await videos.findOne({ "videoname": reg })
        // 搜索得出多个视频
        // const query = videos.find({"videoname":reg}).sort({ videoview: -1 });
        // var video = await query.toArray();
        if (video != null) {
            video = { ...video, _id: '' };
            res.send(new Umsg(0, 'get success', video));
            console.log(video);
        }
        else {
            res.send(new Umsg(1, 'get faild', null))
        }
    }
    finally {
        // await client.close();
    }

}


//添加一个视频
async function addVideo(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        const query = {
            id: req.body.id,
            videoname: req.body.videoname,
            videotype: req.body.videotype,
            videoimg: req.body.videoimg,
            videolink: req.body.videolink,
            videoepisodes: req.body.videoepisodes,
            videoview: req.body.videoview
        };
        var video = await videos.findOne({ videoname: query.videoname })
        if (query.videoname != null && video == null) {
            video = { ...video, _id: '' };
            videos.insertOne(query);
            videos.find({ 'id': { $type: 2 } }).forEach(
                function (doc) {
                    videos.updateMany({ '_id': doc._id }, { $set: { 'id': parseInt(doc.id), 'videoview': parseInt(doc.videoview) } })
                }
            )
            res.send(new Umsg(0, 'add success', query));
        } else {
            res.send(new Umsg(1, 'add faild,video is Already existed', null));
        }
    }
    finally {
        // await client.close();
    }
}

//查询按分类并按播放量从高到低排列视频
async function getType(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        var videotype = req.body.videotype
        const query = videos.find({ videotype }).sort({ videoview: -1 });
        var video = await query.toArray()
        // console.log(video[0]._id);
        if (video != null) {
            for (var i = 0; i < video.length; i++) {
                video[i] = { ...video[i], _id: '' };
            }
            res.send(new Umsg(0, 'get success', video));
        }
        else {
            res.send(new Umsg(1, 'get faild', null))
        }
    }
    finally {
        // await client.close();
    }

}

//推荐受欢迎的视频
async function view(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        // var videoview = req.body.videoview
        const query = videos.find().sort({ videoview: -1 });
        var video = await query.toArray()
        // console.log(video[0]._id);
        if (video != null) {
            for (var i = 0; i < video.length; i++) {
                video[i] = { ...video[i], _id: '' };
            }
            res.send(new Umsg(0, 'get success', video));
        }
        else {
            res.send(new Umsg(1, 'get faild', null))
        }
    }
    finally {
        // await client.close();
    }

}

//更新视频的播放量
async function updateVideo(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const videos = database.collection(collection);
        // create a filter for a video to update
        const query = { videoname: req.body.videoname }
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the user
        var video = await videos.findOne(query)
        var videoview = video.videoview + 1;

        const updateDoc = {
            $set: {
                videoview: parseInt(videoview)
            },
        };

        const result = await videos.updateOne(query, updateDoc, options);
        res.send(new Umsg(0, 'get success', result));
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
    } finally {
        // await client.close();
    }
}



videoDao.getVideo = getVideo
videoDao.getVideos = getVideos
videoDao.getOneVideo = getOneVideo
videoDao.addVideo = addVideo
videoDao.getType = getType
videoDao.view = view
videoDao.updateVideo = updateVideo




module.exports = videoDao

