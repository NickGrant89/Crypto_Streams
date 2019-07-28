const mongoose = require('mongoose');

// User schema

const TransSchema = mongoose.Schema({
    datetime:{type: String},
    app:{type: String},
    hls:{type: String, default: 'true'},
    hlsFlags:{type: String, default: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'},
    dash: {type: String, default: 'true'},
    dashFlags: {type: String, default: '[f=dash:window_size=3:extra_window_size=5]'},
    mp4: {type: String, default: 'true'},
    mp4Flags: {type: String, default: '[movflags=faststart]'},
    user:{type: String},
    currenttime: {type: String},
    updatedtime: {type: String}
});


let Trans = module.exports = mongoose.model('Trans', TransSchema);