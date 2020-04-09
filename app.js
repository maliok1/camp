const express = require('express');
const app = express();


app.set('view engine' , 'ejs')

app.get('/', function(req,res){
  res.render('landing')
})
app.get('/campgrounds', function(req,res){
  let campgrounds = [
    {name: 'Salmon Creek', image: 'https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507441732c7dd19344c5_340.jpg'},
    {name: 'Granite Hill', image: 'https://pixabay.com/get/52e7d0454d55a814f1dc84609620367d1c3ed9e04e507441732c7dd19344c5_340.jpg'},
    {name: 'Mountain Goat', image: 'https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507441732c7dd19344c5_340.jpg'}
  ]

  res.render('campgrounds', {campgrounds: campgrounds})
})

app.listen(3000, function(){
  console.log('Camp app is runnning');
})