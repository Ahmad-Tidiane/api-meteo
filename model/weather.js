const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({

    temperature : Number,
    humidite : Number,
    vitesse_vent : Number,
    date : {
        type : Date,
        default: Date.now()
    }
})  

module.exports = mongoose.model('Weather', weatherSchema);