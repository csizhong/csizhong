const { MongoClient, ConnectionPoolMonitoringEvent } = require("mongodb");
var jwt = require('jsonwebtoken');

const uri = require('../tools/ConfigPraser.js')
// Replace the uri string with your connection string.

const client = new MongoClient(uri);
const collection = 'user'

var userDao = new Object()
// 构造用户对象函数
function User(email, username, pwd, sex, phone) {
    this.email = email
    this.username = username
    this.pwd = pwd
    this.sex = sex
    this.phone = phone
}

function Umsg(code, msg, data) {
    this.code = code
    this.msg = msg
    this.data = data
}

//登陆
async function getUser(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        var email = req.body.email
        const query = { email };
        var user = await users.findOne(query)
        if (user != null) {
            if (req.body.pwd == user.pwd) {
                user = { ...user, pwd: '', _id: '' };
                const tokenStr = jwt.sign(user, 'shhhhh', { expiresIn: '1h' });
                user.token = 'Bearer ' + tokenStr;
                res.send(new Umsg(0, 'login success', user));
                console.log(user);
            }
            else {
                user = { ...user, pwd: '', _id: '' }
                res.send(new Umsg(1, 'login faild', null))
            }
        } else {
            res.send(new Umsg(1, 'login faild', null));
        }
    }
    finally {
        // await client.close();
    }

}

//查询当前登陆用户的信息
async function getLoginUser(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        var username = req.body.username;
        const query = { username };
        var user = await users.findOne(query)
        if (user != null) {
            user = { ...user, pwd: '', _id: '', confirmpwd: '' };
            res.send(new Umsg(0, 'login success', user));
            console.log(user);
        }
        else {
            res.send(new Umsg(1, 'login faild', null));
        }
    }
    finally {
        // await client.close();
    }

}


//添加一个用户
async function addUser(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        const query = {
            email: req.body.email,
            pwd: req.body.pwd,
            username: req.body.username,
            confirmpwd: req.body.confirmpwd
        };
        var user = await users.findOne({ email: query.email })
        var user1 = await users.findOne({ username: query.username })
        if (query.email != null && user == null) {
            if (query.username != null && user1 == null) {
                if (query.pwd == query.confirmpwd) {
                    user = { ...user, pwd: '', _id: '', confirmpwd: '' };
                    users.insertOne(query);
                    var newUser = new User(query.email, query.username, query.pwd)
                    res.send(new Umsg(0, 'register success', newUser));
                } else {
                    res.send(new Umsg(3, 'register faild,pwd do not agree with confirmpwd', null));
                }

            } else {
                res.send(new Umsg(2, 'register faild, username is Already existed', null));
            }
        } else {
            res.send(new Umsg(1, 'register faild, email is Already existed', null));
        }
        // console.log(`A document was inserted with the _id: ${user.insertedId}`);
    }
    finally {
        // await client.close();
    }
}
// 更新用户信息
async function updateUser() {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        // create a filter for a user to update
        const filter = { username: "zkx" };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the user
        const updateDoc = {
            $set: {
                username: 'kk'
            },
        };
        const result = await users.updateOne(filter, updateDoc, options);
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
    } finally {
        // await client.close();
    }
}
//用户修改个人信息
async function changeInfo(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        var username = req.body.username;
        const query = { username };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                nickname: req.body.nickname,
                mysignature: req.body.mysignature,
                sex: req.body.sex
            },
        };
        const result = await users.updateOne(query, updateDoc, options);
        res.send(new Umsg(0, 'update success', result));
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
    } finally {
        // await client.close();
    }
}

//用户修改密码
async function changePwd(req, res) {
    try {
        await client.connect();
        const database = client.db();
        const users = database.collection('user');
        var username = req.body.username;
        const query = { username };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                pwd: req.body.changePwd
            },
        };
        const result = await users.updateOne(query, updateDoc, options);
        res.send(new Umsg(0, 'update success', result));
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
    } finally {
        // await client.close();
    }
}

// 删除用户信息
async function deleteUser() {
    try {
        await client.connect();

        const database = client.db();
        const users = database.collection(collection);

        // Query for a movie that has title "Annie Hall"
        const query = { username: "LiSi" };

        const result = await users.deleteOne(query);
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
        }
    } finally {
        // await client.close();
    }
}


userDao.getUser = getUser
userDao.getLoginUser = getLoginUser
userDao.addUser = addUser
userDao.updateUser = updateUser
userDao.changeInfo = changeInfo
userDao.changePwd = changePwd
userDao.deleteUser = deleteUser



module.exports = userDao
// run().catch(console.dir);
