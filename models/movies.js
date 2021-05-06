const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moviesSchema = new Schema({
    name:{
        type : String,
        require:true
    },
    img:{
        type:String,
        required:true
    },
    summary:{
        type:String,
        require : true
    }
},{timestamps:true})

const Movies = mongoose.model('Movies', moviesSchema)
module.exports = Movies;