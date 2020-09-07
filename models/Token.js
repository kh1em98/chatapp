const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tokenSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 90
    }
})

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;