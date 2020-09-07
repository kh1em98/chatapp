const mongoose = require('mongoose');
const schema = mongoose.Schema;


const UserSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://i.kym-cdn.com/photos/images/original/001/882/230/7fd.jpg"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;