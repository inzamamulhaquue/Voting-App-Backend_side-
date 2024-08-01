const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    party:{
        type: String,
        require: true,
    },
    age:{
        type: Number,
        require: true,
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true,
            },
            votedAt:{
                type: Date,
                default: Date.now(),
            },
        }
    ],
    votedCount:{
        type: Number,
        default: 0,
    },
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;