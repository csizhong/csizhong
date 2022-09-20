const fs = require('fs')
const path = require('path')
var fpath = path.join(__dirname, '../config/databaseConfig.txt')
var content = fs.readFileSync(fpath, 'utf8')
module.exports = content