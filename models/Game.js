const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 4,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        minLength: 10,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        enum: {
            values: ['PC', 'Nintendo', 'PS4', 'S5', 'XBOX'],
            message: 'Invalid platform',
        },
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    buyers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;