const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    image: String,
    people: Number,
    rooms: Number,
    city: String,
    from: Date,
    to: Date,
    email: String,
    phone: Number,
    title: String,
    description: String,
})

module.exports = ImageModal = mongoose.model('imageModal', ImageSchema);

