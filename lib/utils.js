const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

function issueJwt(user, res) {
    const payload = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        isVerified: user.isVerified,
        iat: Date.now()
    };


    const signedToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '10m'
    });

    const lastDot = signedToken.lastIndexOf('.');
    const headerAndPayload = signedToken.substr(0, lastDot);
    const signature = signedToken.substr(lastDot + 1);

    res.cookie('headerAndPayload', headerAndPayload, {
        maxAge: 600000
    });
    res.cookie('signature', signature, {
        httpOnly: true
    })
}

async function isValidPassword(password, hashPassword) {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
}

async function isUserExist(email) {
    const existUser = await User.findOne({
        email: email
    })
    if (existUser == '') {
        return false;
    } else {
        return true;
    }
}

function moveToHeaderArray(arr, elementToMove) {
    arr.forEach((element, i) => {
        if (element._id === elementToMove._id) {
            arr.splice(i, 1);
            arr.unshift(elementToMove);
        }
    })
}

module.exports.issueJwt = issueJwt;
module.exports.isValidPassword = isValidPassword;
module.exports.isUserExist = isUserExist;
module.exports.moveToHeaderArray = moveToHeaderArray;