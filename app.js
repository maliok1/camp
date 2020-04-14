const express = require('express');
const app = express();
const db = require('dotenv').config();
const bodyParser= require('body-parser');
const mongoose = require ('mongoose');

const Campground = require ('./models/campground');
const Comment = require ('./models/comment');

seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb+srv://anastasia:'+ process.env.DB_PASS + '@cluster0-6kfek.mongodb.net/test?retryWrites=true&w=majority', { 
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

//SCHEMA SETUP
	

// Campground.create(
//    {
// 	name: 'Mountain Goat', 
// 	image: 'https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507441732c7dd19344c5_340.jpg',
// 	   description:'this is a huge mpintaine goat, no bathrooms. No water. Beatiful mountain'
//    }
// , function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log('new campground');
//     console.log(campground);
//   }
// })


//Routes
app.get('/', function(req,res){
  res.render('landing')
})
app.get('/campgrounds', function(req,res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			 res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
})

app.post('/campgrounds', function(req,res){
  //get data from the form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;	
  let newCampground = {name: name, image: image, description:desc}
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreate){
	  if(err){
		  console.log(err);
	  } else{
		res.redirect('campgrounds/index')  
	  }
  })  
})

app.get('/campgrounds/new', function(req,res){	
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', function(req,res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground ){
		  if(err){
			  console.log(err)
		  } else{
			  res.render('campgrounds/show' , {campground:foundCampground} )
		  }
  })
  
})

// ==========================
// COMMENTS
// ==========================
app.get('/campgrounds/:id/comments/new', function(req,res){
		Campground.findById(req.params.id,function(err, campground){
			if(err){
				console.log(err)
			} else{
				res.render('comments/new', {campground: campground})
			}
		})
})

app.post('/campgrounds/:id/comments', function(req,res){
	Campground.findById(req.params.id,function(err, campground){
			if(err){
				console.log(err);
				res.redirect('campgrounds');
			} else{
				Comment.create(req.body.comment, function(err,comment){
					if(err){
						console.log(err);
					} else{
						campground.comments.push(comment);
						campground.save();
						res.redirect('/campgrounds/' + campground._id);
					}
				})				
			}
})
})
app.listen(3000, function(){
  console.log('Camp app is runnning');
})