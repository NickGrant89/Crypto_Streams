const mongoose = require('mongoose');

// User schema

const StreamSchema = mongoose.Schema({
    
    tasks:{
        app: String,
        hls:{type: Boolean, default: true},
        hlsFlags:{type: String, default: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'},
        dash: {type: Boolean, default: true},
        dashFlags: {type: String, default: '[f=dash:window_size=3:extra_window_size=5]'},
        mp4: {type: Boolean, default: true},
        mp4Flags: {type: String, default: '[movflags=faststart]'},
    },
    datetime:{type: String},
    app:{type: String},
    hls:{type: Boolean, default: true},
    hlsFlags:{type: String, default: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'},
    dash: {type: Boolean, default: true},
    dashFlags: {type: String, default: '[f=dash:window_size=3:extra_window_size=5]'},
    mp4: {type: Boolean, default: true},
    mp4Flags: {type: String, default: '[movflags=faststart]'},
    streamkey:{type: String},
    facebookkey:{type: String},
    youtubekey:{type: String},
    mode: {type: String},
    edge: {type: String},
    user:{}
});


let Stream = module.exports = mongoose.model('Stream', StreamSchema);