const mongoose = require('mongoose');

// Calender schema

const CalenderSchema = mongoose.Schema({
    title:{
        type: String
    },
    //'2019-08-12T12:30:00'
    start:{
        type: String
    },
    //'2019-08-12T12:30:00'
    end:{
        type:String
    },
    dayoftheweek:{type:String},
    url:{type:String},
    live:{type:Boolean},
});


let Calender = module.exports = mongoose.model('Calender', CalenderSchema);