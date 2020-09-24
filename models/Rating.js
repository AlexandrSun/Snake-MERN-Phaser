const {Schema, model} = require('mongoose');

const schema = new Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    score: {type: Number, default: 0},
});

module.exports = model('Rating', schema);