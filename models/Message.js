const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MessageSchema = new schema({
    idSend: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    idRecv: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    unseen: {
        type: Boolean,
        default: true
    }
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;