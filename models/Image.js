const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ImageSchema = new Schema({
    img: {
        data : Buffer,
        name : String,
        mimetype : String
    }
})

var Image = mongoose.model('Image',ImageSchema)

module.exports = Image