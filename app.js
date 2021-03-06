const express = require('express');
const app = express();
const db = require('dotenv').config();
const bodyParser= require('body-parser');
const mongoose = require ('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require ('./models/campground');
const Comment = require ('./models/comment');
const User = require('./models/user');

// const seedDB = require('./seeds');

//requiring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes     = require('./routes/comments');
const indexRoutes       = require('./routes/index');

mongoose.connect('mongodb+srv://anastasia:sTeeleCourse@cluster0-6kfek.mongodb.net/test?retryWrites=true&w=majority', { 
useUnifiedTopology: true,  
useNewUrlParser: true,
useCreateIndex: true
}).then(()=>{
	console.log('connected to DB')
}).catch(err =>{
		console.log('error',err.message)
})

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require('moment');
//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "That's a secret",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
  console.log('Camp app is runnning');
})
// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('Camp app is runnning');
// })