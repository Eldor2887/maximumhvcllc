const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewUser: {
        type: String
    },
    reviewUserEmail: {
        type: String
    },
    rating: {
        type: Number
    },
    review: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Review', reviewSchema);
