const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const movieRouters = require('./routes/movieRouters')
const { bgYellowBright } = require('ansi-styles');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const url = 'mongodb://localhost/curdDB'


const app = express();

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false})
    .then((result) => app.listen(4000))
    .catch((err) => console.log(err))

const con = mongoose.connection

con.on('open',  () => {
    console.log("yes Connected");
})

//register view engine
app.set('view engine', 'ejs');

// middleware and static file
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(methodOverride('_method'))
app.use(bodyParser.json())

app.use(movieRouters)






