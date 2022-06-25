// Importing modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//importing models
const usermodel = require('../models/userModel')
//passport library
const passport  =require('passport')
const session = require('express-session')
const LocalStratergy = require('passport-local').Strategy

var indexRouter = require('../routes/index');
var loginRouter = require('../routes/login')

//connecting to database
const db  = require('../db/db')
db.connectDb();

// Instantiate Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));

//middleware for session
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
//middleware for passport
app.use(passport.initialize())
app.use(passport.session())


const authUser = (user,password,done)=>{
  usermodel.findOne({username:user},(err,results)=>{
    if(err){
      return done(null,false)
    }
    if(!results){
      return done(null,false)
    }
    if(results){
      if(results.password!=password){
        return done(null,false)
      }else{
        return done(null,{id:results._id,name:results.username})
      }
    }
  })

}

passport.use(new LocalStratergy(authUser))

passport.serializeUser( (userObj, done) => {    done(null, userObj)})
passport.deserializeUser((userObj, done) => {      done (null, userObj )})

app.use('/', indexRouter);
app.use('/login',loginRouter);


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
