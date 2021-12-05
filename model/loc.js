const mongoose = require('mongoose');

const locSchema = new mongoose.Schema({
    name : String,
    latitude : String,
    longitude : String,
    weather : {
        type: mongoose.Schema.ObjectId,
        ref: 'Weather',
        required: true
    }
});



module.exports = mongoose.model('Location', locSchema);