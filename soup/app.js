var createError = require('http-errors');
var express = require('express')
var app = express()

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var sql = require('./database');
var jwt = require('jsonwebtoken');
// view engine setup
const withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    next()
  } else {
    jwt.verify(token, 'abcd', function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}


app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',cors(),(req,res) => {
 res.send('hf')
})
app.post('/register',cors(), (req,res) => {
 
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(req.body.nickName)
  sql.query(`insert into users (email, nickName, date) values(?,?,?)`,[req.body.email,req.body.nickName, date],(error, results, fields) => {
   if(error) {
     console.log(err)
   } else {
     console.log(results)
     const token = jwt.sign({email:req.body.email} , 'abcd' , {
       expiresIn: '1h'
     });
     res.json({token:token});
   }
  })
})

app.post('/home/createRoom', cors(), (req,res) => {
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  sql.query(`insert into chatroom (name, date) values(?,?)`,[req.body.name, date],(error, results, fields) => {
   if(error) {
     console.log(err)
   } else {
     console.log(results[0])
      res.json({value:'success'})
   }
  })
})

app.post('/login', cors(), (req,res) => {
  sql.query(`select * from users where email = ?`,[req.body.email],(error,results,fields) => {
    if(error) {
      console.log(error)
    } else {
      console.log(results[0].email);
      var id = results[0].id
      sql.query(`select name from chatroom where room_id in (select room_id from users_chatroom where users_chatroom.id = ?)`,[id], (err,result, field) => {
        if(err) {
          console.log(err)
        } else {
          res.json({result})
        }
      })
     
    }
  } )
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
