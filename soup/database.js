var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'kachra',
  password : 'KachraWala',
  database : 'gupshup'
})

module.exports = connection