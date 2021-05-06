const multer = require('multer')
const Movies = require('../models/movies')
const express = require('express');
const router = express.Router();


const storage = multer.diskStorage({

    //destination for files
    destination:function(request,file,callback){
        callback(null,'./public/uploads/images')
    },

    //add back the extention
    filename:function(request,file,callback){
        /*callback(null,Date.now()+file.originalname)*/
        callback(null,Date.now()+file.originalname)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
    {
        cb(null,true);
    }
    else
    {
        cb(null,false);
    }
}

//Upload paramaters
const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*5
    },fileFilter:fileFilter
});

router.get('/', (req, res) => {

    res.redirect('/movies');
});

router.get('/movies',(req,res) => {
    Movies.find().sort({createdAt: -1})
        .then((result) => {
            res.render('index',{movies:result})
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/movies', upload.single('movieImage'),async(req,res) => {
    var addMovie = new Movies({
        name:req.body.movieName,
        summary:req.body.summary,
        img:req.file.filename,
    })

    addMovie.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
})

router.get('/movies/create-movies', (req, res) => {
    res.render('create');
});

router.get('/movies/:id', (req,res) => {

    const id = req.params.id;
    Movies.findById(id)
        .then(result => {
            res.render('movieDetails', {movieDetail : result});
        })
        .catch((err) => {
            console.log(err);
        })
})

router.delete('/movies/:id', (req,res) => {
    const id = req.params.id;

    Movies.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/'});
    })
    .catch((err) => {
        console.log(err);
    })
})

router.get('/movies/update/:id', (req,res) => {
    const id = req.params.id;

    Movies.findById(id)
        .then(result => {
            res.render('updateMovie', {movieUpdate : result})
        })
        .catch((err) => {
            cosole.log(err);
        })
})

router.put('/movies/update/:id', upload.any(), async (req,res) => {
    
    console.log(req.body);
    var options = true;

    if(req.body.img)
    {
        Movies.findByIdAndUpdate( req.params.id, 
            {$set:{
            name: req.body.name,
            summary: req.body.summary,
            img: req.body.filename
        }
    }) .then(result => {
        res.json('Success')
      })
     .catch(error => console.error(error))
    }
    else
    {
        Movies.findByIdAndUpdate( req.params.id, 
            {$set:{
            name: req.body.name,
            summary: req.body.summary,
        }
    }) .then(result => {
        res.json('Success')
      })
     .catch(error => console.error(error))
    }
})

module.exports = router;