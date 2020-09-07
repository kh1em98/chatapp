const {
    moveToHeaderArray
} = require('./lib/utils');
const _ = require('lodash');
const User = require("./models/User");
const {
    commonEmitter
} = require('./config/emitter');

var listUser = [];


module.exports = function (io) {

    commonEmitter.on('coNguoiDangKy', async ({
        _id,
        name,
        avatar
    }) => {

        if (_.isEmpty(listUser)) {
            listUser = await User.find({}, 'name avatar');
            listUser = JSON.parse(JSON.stringify(listUser));
            listUser.forEach((user) => {
                if (user._id === idUserOnline) {
                    user.isOnline = true;
                    user.socketId = socket.id;
                    moveToHeaderArray(listUser, user);
                } else {
                    user.isOnline = false;
                }
            })
        } else {
            const newUser = {
                _id: _id.toString(),
                name,
                avatar,
                isOnline: false
            }
            listUser.push(newUser);
        }
        io.emit('coNguoiOnline', listUser);
    })

    commonEmitter.on('coNguoiThayAvatar', ({
        _id,
        avatar
    }) => {
        for (let i = 0; i < listUser.length; i++) {
            if (listUser[i]._id === _id) {
                listUser[i].avatar = avatar;
                break;
            }
        }
        io.emit('coNguoiOnline', listUser);
    })


    io.on('connection', (socket) => {
        socket.on('taoOnlineNe', async (idUserOnline) => {

            if (_.isEmpty(listUser)) {
                listUser = await User.find({}, 'name avatar lastActive');
                listUser = JSON.parse(JSON.stringify(listUser));
                listUser.forEach((user) => {
                    if (user._id === idUserOnline) {
                        user.isOnline = true;
                        user.socketId = socket.id;
                        moveToHeaderArray(listUser, user);
                    } else {
                        user.isOnline = false;
                    }
                })
            } else {
                for (let i = 0; i < listUser.length; i++) {
                    if (listUser[i]._id === idUserOnline) {
                        listUser[i].isOnline = true;
                        listUser[i].socketId = socket.id;
                        moveToHeaderArray(listUser, listUser[i]);
                        break;
                    }
                }
            }
            io.emit('coNguoiOnline', listUser);
        })

        socket.on('taoOfflineNe', async (idUserOffline) => {
            for (let i = 0; i < listUser.length; i++) {
                if (listUser[i]._id === idUserOffline) {
                    listUser[i].isOnline = false;
                    listUser[i].socketId = null;
                    listUser[i].lastActive = Date.now();
                    break;
                }
            }
            socket.broadcast.emit('coNguoiOffline', listUser);
            await User.findByIdAndUpdate(idUserOffline, {
                $set: {
                    lastActive: Date.now()
                }
            })


        })

        socket.on('disconnect', async () => {
            let idUserOffline;
            for (let i = 0; i < listUser.length; i++) {
                if (listUser[i].socketId === socket.id) {
                    idUserOffline = listUser[i]._id;
                    listUser[i].isOnline = false;
                    listUser[i].socketId = null;
                    listUser[i].lastActive = Date.now();
                    break;
                }
            }
            socket.broadcast.emit('coNguoiOffline', listUser);
            await User.findByIdAndUpdate(idUserOffline, {
                $set: {
                    lastActive: Date.now()
                }
            })
        })

        socket.on('sendMessage', (message) => {
            const {
                idSend,
                content,
                socketId,
                idNewMessage
            } = message;



            io.to(socketId).emit('coTinNhanMoi', {
                idSend,
                content,
                idNewMessage
            });
        })
    })
}